/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyCZda7J8uGc9eXXNXzCTOUZGGknDFY3j10",
    NEXT_PUBLIC_CURRENCY_API_KEY: process.env.NEXT_PUBLIC_CURRENCY_API_KEY || "df77420b4ddd8b6e22beb231",
    NEXT_PUBLIC_AUTH_API_KEY: process.env.NEXT_PUBLIC_AUTH_API_KEY || "AIzaSyCatXA-4JHKWR5VgyWQJ9GkPjHN7WmC_Yo",
    NEXT_PUBLIC_WEATHER_API_KEY: process.env.NEXT_PUBLIC_WEATHER_API_KEY || "placeholder-weather-api-key",
    NEXT_PUBLIC_CESIUM_ION_TOKEN: process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN || "placeholder-cesium-token",
    NEXT_PUBLIC_OPENROUTE_API_KEY: process.env.NEXT_PUBLIC_OPENROUTE_API_KEY || "placeholder-openroute-api-key"
  },
  images: {
    domains: ['maps.googleapis.com', 'api.openweathermap.org'],
  },
}

export default nextConfig

