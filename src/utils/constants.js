let tempRecaptchKey = "6LeyjgAhAAAAALpiwiHPa5m6kVzGX9i6Fg51YTla";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  console.log("dev");
} else {
  tempRecaptchKey = "6LeRuf4gAAAAAMlsWUkSD9oTjze_kFa-k9ArZv_-";
}

export let recaptchKey = tempRecaptchKey;
