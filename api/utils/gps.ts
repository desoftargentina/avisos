export interface GPSData {
  country?: number;
  state?: number;
  city?: number;
}

class GPSParser {
  serialize(data: GPSData): number {
    let gps = 0;

    if (data.country) gps |= (data.country & 0x3ff) << 22;
    if (data.state) gps |= (data.state & 0xfff) << 10;
    if (data.city) gps |= data.city & 0x3ff;

    return gps;
  }

  deserialize(gps: number): GPSData {
    return {
      country: (gps & 0xffc00000) >> 22,
      state: (gps & 0x3ffc00) >> 10,
      city: gps & 0x3ff
    };
  }

  merge(base: number, extra: number): number {
    const gBase = this.deserialize(base),
      gExtra = this.deserialize(extra);
    if (!gBase.city) {
      gBase.city = gExtra.city;
      if (!gBase.state) {
        gBase.state = gExtra.state;
        if (!gBase.country) gBase.country = gExtra.country;
      }
    } else return base;
    return this.serialize(gBase);
  }

  query(gps: number): string {
    const data = this.deserialize(gps);
    if (data.city) return `= ${gps}`;
    if (data.state) return `between ${gps & 0x3ffc00} and ${gps | 0x3ff}`;
    if (data.country) return `between ${gps & 0xffc00000} and ${gps | 0x3fffff}`;
    return '= 0';
  }

  token(field: string, gps?: number): string {
    if (!gps) return `group_concat(distinct (${field} & 0xffc00000)) as countries`;
    const data = this.deserialize(gps);
    if (data.city) return undefined;
    if (data.state) return `group_concat(distinct ${field}) as cities`;
    if (data.country) return `group_concat(distinct (${field} & 0xfffffc00)) as states`;
    else return '[0] as countries';
  }
}

export const Gps = new GPSParser();
export default Gps;
