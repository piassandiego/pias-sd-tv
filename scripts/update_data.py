#!/usr/bin/env python3
"""Fetch free US-government data for the in-store TV live slides and write data/*.json.
Sources: National Weather Service API (api.weather.gov), NOAA NDBC buoys (CDIP-operated),
USDA NRCS SNOTEL (AWDB REST API). All public domain, no keys. Python standard library only.
Run: python3 scripts/update_data.py   (writes to ../data relative to this file)"""
import json, re, sys, time, datetime as dt, urllib.request
from pathlib import Path
from zoneinfo import ZoneInfo

OUT = Path(__file__).resolve().parent.parent / 'data'
UA = {'User-Agent': '(PIAS San Diego in-store TV, piassandiego.github.io/pias-sd-tv)', 'Accept': 'application/geo+json, application/json, text/plain'}
PT = ZoneInfo('America/Los_Angeles')

def get(url, raw=False, tries=3):
    for n in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
                b = r.read().decode('utf-8', 'replace')
                return b if raw else json.loads(b)
        except Exception as e:
            if n == tries - 1: raise
            time.sleep(2 + 3 * n)

def c2f(c): return None if c is None else round(c * 9 / 5 + 32)
def kmh2mph(v): return None if v is None else round(v / 1.609344)
COMPASS = 'N NNE NE ENE E ESE SE SSE S SSW SW WSW W WNW NW NNW'.split()
def compass(deg): return None if deg is None else COMPASS[int((float(deg) % 360) / 22.5 + .5) % 16]
def now_iso(): return dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')

_points = {}
def point(lat, lon):
    k = f'{lat:.4f},{lon:.4f}'
    if k not in _points: _points[k] = get(f'https://api.weather.gov/points/{k}')['properties']
    return _points[k]

def parse_iso_interval(s):
    start, dur = s.split('/')
    start = dt.datetime.fromisoformat(start)
    m = re.match(r'P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?', dur)
    d, h, mi = (int(x or 0) for x in m.groups())
    return start, start + dt.timedelta(days=d, hours=h, minutes=mi)

def snowfall_in(grid_url, hours=72):
    g = get(grid_url)['properties']
    now = dt.datetime.now(dt.timezone.utc); end = now + dt.timedelta(hours=hours); total = 0.0
    for v in g.get('snowfallAmount', {}).get('values', []):
        a, b = parse_iso_interval(v['validTime'])
        if b <= now or a >= end or not v['value']: continue
        frac = (min(b, end) - max(a, now)).total_seconds() / max(1, (b - a).total_seconds())
        total += v['value'] * frac  # mm
    return round(total / 25.4, 1)

def weather():
    lat, lon = 32.9607, -117.1134  # 9925 Carmel Mountain Rd, San Diego 92129 (US Census geocoder)
    p = point(lat, lon)
    fc = get(p['forecast'])['properties']['periods']
    hourly = get(p['forecastHourly'])['properties']['periods']
    obs = None
    for st in ['KNKX', 'KMYF']:
        try:
            o = get(f'https://api.weather.gov/stations/{st}/observations/latest')['properties']
            if o['temperature']['value'] is not None:
                obs = {'station': st, 'tempF': c2f(o['temperature']['value']), 'text': o.get('textDescription') or '',
                       'windMph': kmh2mph(o['windSpeed']['value']), 'windDir': compass(o['windDirection']['value']),
                       'humidity': None if o['relativeHumidity']['value'] is None else round(o['relativeHumidity']['value']),
                       'time': o['timestamp']}
                break
        except Exception as e: print('obs', st, e, file=sys.stderr)
    h0 = hourly[0]
    today = dt.datetime.now(PT).date(); hi = lo = None
    temps = [x['temperature'] for x in hourly if dt.datetime.fromisoformat(x['startTime']).astimezone(PT).date() == today]
    for x in fc[:3]:
        if dt.datetime.fromisoformat(x['startTime']).astimezone(PT).date() == today:
            if x['isDaytime']: hi = x['temperature']
            else: lo = x['temperature']
    hi = hi if hi is not None else (max(temps) if temps else None)
    lo = lo if lo is not None else (min(temps) if temps else None)
    days = []
    for i, x in enumerate(fc):
        if not x['isDaytime']: continue
        d = dt.datetime.fromisoformat(x['startTime']).astimezone(PT).date()
        if d == today: continue
        night = next((y for y in fc[i+1:i+2] if not y['isDaytime']), None)
        days.append({'name': x['name'], 'high': x['temperature'], 'low': night['temperature'] if night else None,
                     'short': x['shortForecast'], 'pop': (x.get('probabilityOfPrecipitation') or {}).get('value')})
        if len(days) == 3: break
    return {'updated': now_iso(), 'place': 'Rancho Peñasquitos · 9925 Carmel Mountain Rd',
            'current': {'tempF': obs['tempF'] if obs else h0['temperature'], 'text': (obs or {}).get('text') or h0['shortForecast'],
                        'windMph': obs['windMph'] if obs and obs['windMph'] is not None else int(re.findall(r'\d+', h0['windSpeed'])[0]),
                        'windDir': (obs or {}).get('windDir') or h0['windDirection'], 'humidity': (obs or {}).get('humidity'),
                        'station': (obs or {}).get('station'), 'obsTime': (obs or {}).get('time')},
            'today': {'high': hi, 'low': lo, 'short': fc[0]['shortForecast'], 'name': fc[0]['name']},
            'outlook': days, 'source': 'National Weather Service'}

# name, area, lat, lon (summit / upper mountain), SNOTEL triplet or None
SOCAL = [('Snow Summit', 'Big Bear Mountain Resort', 34.2207, -116.8913, None),
         ('Bear Mountain', 'Big Bear Mountain Resort', 34.2167, -116.8600, None),
         ('Snow Valley', 'Running Springs', 34.2160, -117.0370, None),
         ('Mountain High', 'Wrightwood', 34.3720, -117.6950, None)]
WEST = [('Mammoth Mountain', 'Mammoth Lakes, CA', 37.6380, -119.0300, None),
        ('Palisades Tahoe', 'Olympic Valley, CA', 39.1820, -120.2560, '784:CA:SNTL'),
        ('Heavenly', 'South Lake Tahoe, CA', 38.9280, -119.9070, '518:CA:SNTL'),
        ('Brian Head', 'Brian Head, UT', 37.6920, -112.8520, '1154:UT:SNTL'),
        ('Park City', 'Park City, UT', 40.6450, -111.5250, '814:UT:SNTL')]

def snotel_depth(trip):
    end = dt.date.today(); beg = end - dt.timedelta(days=5)
    j = get(f'https://wcc.sc.egov.usda.gov/awdbRestApi/services/v1/data?stationTriplets={trip}&elements=SNWD&duration=DAILY&beginDate={beg}&endDate={end}')
    vals = [v for v in j[0]['data'][0]['values'] if v.get('value') is not None]
    return (round(vals[-1]['value']), vals[-1]['date']) if vals else (None, None)

def resorts(lst):
    out = []
    for name, area, lat, lon, trip in lst:
        try:
            p = point(lat, lon); fc = get(p['forecast'])['properties']['periods']
            r = {'name': name, 'area': area, 'tempF': fc[0]['temperature'], 'period': fc[0]['name'],
                 'short': fc[0]['shortForecast'], 'snow3dayIn': snowfall_in(p['forecastGridData'])}
            if trip:
                try:
                    d, day = snotel_depth(trip)
                    if d is not None: r['snowDepthIn'] = d; r['snowDepthDate'] = day
                except Exception as e: print('snotel', trip, e, file=sys.stderr)
            out.append(r)
        except Exception as e: print('resort', name, e, file=sys.stderr)
    if not out: raise RuntimeError('no resorts')
    return {'updated': now_iso(), 'resorts': out,
            'source': 'Mountain weather & snowfall: National Weather Service (not official resort reports)' +
                      ('; snow depth: USDA NRCS SNOTEL' if any('snowDepthIn' in r for r in out) else '')}

BUOYS = [('46225', 'Torrey Pines Outer'), ('46254', 'Scripps Nearshore'), ('46258', 'Mission Bay West'), ('46232', 'Point Loma South')]
SPOTS = [('Del Mar', 32.9590, -117.2690), ('Torrey Pines', 32.9330, -117.2600), ('La Jolla', 32.8500, -117.2730),
         ('Pacific Beach', 32.7960, -117.2560), ('Ocean Beach', 32.7490, -117.2510)]

def buoy(st):
    lines = get(f'https://www.ndbc.noaa.gov/data/realtime2/{st}.txt', raw=True).splitlines()
    hdr = lines[0].lstrip('#').split()
    for ln in lines[2:50]:
        row = dict(zip(hdr, ln.split()))
        if row.get('WVHT', 'MM') != 'MM':
            t = dt.datetime(int(row['YY']), int(row['MM']), int(row['DD']), int(row['hh']), int(row['mm']), tzinfo=dt.timezone.utc)
            if dt.datetime.now(dt.timezone.utc) - t > dt.timedelta(hours=6): return None
            num = lambda k: None if row.get(k, 'MM') == 'MM' else float(row[k])
            wt = None
            for l2 in lines[2:50]:  # water temp may be on a different row
                r2 = dict(zip(hdr, l2.split()))
                if r2.get('WTMP', 'MM') != 'MM': wt = float(r2['WTMP']); break
            return {'waveFt': round(num('WVHT') * 3.28084, 1), 'periodS': None if num('DPD') is None else round(num('DPD')),
                    'dirDeg': num('MWD'), 'dir': compass(num('MWD')), 'waterF': c2f(wt), 'time': t.isoformat()}
    return None

def surf():
    bs = []
    for st, name in BUOYS:
        try:
            b = buoy(st)
            if b: b.update(id=st, name=name); bs.append(b)
        except Exception as e: print('buoy', st, e, file=sys.stderr)
    spots = []
    for name, lat, lon in SPOTS:
        try:
            h = get(point(lat, lon)['forecastHourly'])['properties']['periods'][0]
            spots.append({'name': name, 'windMph': h['windSpeed'].replace(' mph', ''), 'windDir': h['windDirection'],
                          'tempF': h['temperature'], 'short': h['shortForecast']})
        except Exception as e: print('spot', name, e, file=sys.stderr)
    if not bs: raise RuntimeError('no buoys')
    return {'updated': now_iso(), 'buoys': bs, 'spots': spots, 'source': 'Source: NOAA / CDIP buoys · wind: National Weather Service'}

def write(name, fn):
    try: data = fn()
    except Exception as e: print('FAILED', name, e, file=sys.stderr); return False
    p = OUT / f'{name}.json'; new = json.dumps(data, indent=1, ensure_ascii=False)
    if p.exists():  # Leave the file untouched if nothing but the timestamp changed (avoids empty commits).
        try:
            old = json.loads(p.read_text()); old.pop('updated', None)
            if old == {k: v for k, v in data.items() if k != 'updated'}: print('unchanged', p); return True
        except Exception: pass
    p.write_text(new + '\n'); print('wrote', p); return True

if __name__ == '__main__':
    OUT.mkdir(exist_ok=True)
    ok = [write('weather', weather), write('snow-socal', lambda: resorts(SOCAL)), write('snow-west', lambda: resorts(WEST)), write('surf', surf)]
    sys.exit(0 if any(ok) else 1)
