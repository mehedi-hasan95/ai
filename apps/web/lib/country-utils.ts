import * as ct from "countries-and-timezones";

export function getCountryFromTimezone(timezone?: string) {
  if (!timezone) {
    return null;
  }
  const timezoneInfo = ct.getTimezone(timezone);
  if (!timezoneInfo?.countries.length) {
    return null;
  }
  const contryCode = timezoneInfo.countries[0];
  const country = ct.getCountry(contryCode as string);

  return {
    code: contryCode,
    name: country?.name || contryCode,
  };
}

export function getCoungryFlagUrl(countryCode: string) {
  return `https://flagcdn.com/w40/${countryCode.toLocaleLowerCase()}.png`;
}
