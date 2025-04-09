// Define Google Maps types to prevent TypeScript errors
declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions)
      setCenter(latLng: LatLng | LatLngLiteral): void
      setZoom(zoom: number): void
      controls: any[][]
    }

    class Marker {
      constructor(opts?: MarkerOptions)
      setMap(map: Map | null): void
    }

    class DirectionsService {
      route(request: DirectionsRequest, callback: (result: DirectionsResult, status: DirectionsStatus) => void): void
    }

    class DirectionsRenderer {
      constructor(opts?: DirectionsRendererOptions)
      setMap(map: Map | null): void
      setDirections(directions: DirectionsResult): void
    }

    class Geocoder {
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[], status: GeocoderStatus) => void): void
    }

    interface LatLng {
      lat(): number
      lng(): number
    }

    interface LatLngLiteral {
      lat: number
      lng: number
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral
      zoom?: number
      mapTypeControl?: boolean
      streetViewControl?: boolean
      fullscreenControl?: boolean
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral
      map?: Map
      title?: string
      animation?: Animation
      icon?: string | Icon
    }

    interface Icon {
      url: string
      scaledSize?: Size
    }

    class Size {
      constructor(width: number, height: number)
    }

    enum Animation {
      DROP,
      BOUNCE,
    }

    enum TravelMode {
      DRIVING = "DRIVING",
      WALKING = "WALKING",
      BICYCLING = "BICYCLING",
      TRANSIT = "TRANSIT",
    }

    enum DirectionsStatus {
      OK = "OK",
      NOT_FOUND = "NOT_FOUND",
      ZERO_RESULTS = "ZERO_RESULTS",
      MAX_WAYPOINTS_EXCEEDED = "MAX_WAYPOINTS_EXCEEDED",
      INVALID_REQUEST = "INVALID_REQUEST",
      OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
      REQUEST_DENIED = "REQUEST_DENIED",
      UNKNOWN_ERROR = "UNKNOWN_ERROR",
    }

    enum GeocoderStatus {
      OK = "OK",
      ZERO_RESULTS = "ZERO_RESULTS",
      OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
      REQUEST_DENIED = "REQUEST_DENIED",
      INVALID_REQUEST = "INVALID_REQUEST",
      UNKNOWN_ERROR = "UNKNOWN_ERROR",
    }

    interface DirectionsRequest {
      origin: string | LatLng | LatLngLiteral
      destination: string | LatLng | LatLngLiteral
      travelMode: TravelMode
    }

    interface GeocoderRequest {
      address?: string
      location?: LatLng | LatLngLiteral
      bounds?: LatLngBounds
      componentRestrictions?: GeocoderComponentRestrictions
      region?: string
    }

    interface GeocoderComponentRestrictions {
      country: string | string[]
    }

    interface LatLngBounds {
      contains(latLng: LatLng): boolean
      extend(latLng: LatLng): void
      getCenter(): LatLng
      getNorthEast(): LatLng
      getSouthWest(): LatLng
      isEmpty(): boolean
      toJSON(): object
      toSpan(): LatLng
      toString(): string
      union(other: LatLngBounds): LatLngBounds
    }

    interface GeocoderResult {
      address_components: GeocoderAddressComponent[]
      formatted_address: string
      geometry: {
        location: LatLng
        location_type: GeocoderLocationType
        viewport: LatLngBounds
        bounds?: LatLngBounds
      }
      place_id: string
      types: string[]
    }

    interface GeocoderAddressComponent {
      long_name: string
      short_name: string
      types: string[]
    }

    enum GeocoderLocationType {
      APPROXIMATE = "APPROXIMATE",
      GEOMETRIC_CENTER = "GEOMETRIC_CENTER",
      RANGE_INTERPOLATED = "RANGE_INTERPOLATED",
      ROOFTOP = "ROOFTOP",
    }

    interface DirectionsResult {
      routes: DirectionsRoute[]
    }

    interface DirectionsRoute {
      legs: DirectionsLeg[]
      overview_path: LatLng[]
      overview_polyline: string
      warnings: string[]
      waypoint_order: number[]
      bounds: LatLngBounds
    }

    interface DirectionsLeg {
      steps: DirectionsStep[]
      distance: Distance
      duration: Duration
      start_location: LatLng
      end_location: LatLng
      start_address: string
      end_address: string
    }

    interface DirectionsStep {
      instructions: string
      distance: Distance
      duration: Duration
      start_location: LatLng
      end_location: LatLng
      path: LatLng[]
      travel_mode: TravelMode
    }

    interface Distance {
      text: string
      value: number
    }

    interface Duration {
      text: string
      value: number
    }

    interface DirectionsRendererOptions {
      suppressMarkers?: boolean
      polylineOptions?: PolylineOptions
      directions?: DirectionsResult
      map?: Map
    }

    interface PolylineOptions {
      strokeColor?: string
      strokeWeight?: number
    }

    enum ControlPosition {
      TOP_CENTER = 1,
    }
  }

  namespace places {
    class Autocomplete {
      constructor(inputField: HTMLInputElement, opts?: AutocompleteOptions)
      addListener(eventName: string, handler: Function): void
      getPlace(): PlaceResult
    }

    interface AutocompleteOptions {
      fields?: string[]
      componentRestrictions?: ComponentRestrictions
    }

    interface ComponentRestrictions {
      country: string | string[]
    }

    interface PlaceResult {
      formatted_address?: string
      geometry?: {
        location: google.maps.LatLng
      }
      name?: string
      place_id?: string
      vicinity?: string
      rating?: number
    }

    class PlacesService {
      constructor(attrContainer: Element | Map)
      nearbySearch(
        request: NearbySearchRequest,
        callback: (results: PlaceResult[], status: PlacesServiceStatus) => void,
      ): void
      getDetails(request: DetailsRequest, callback: (result: PlaceResult, status: PlacesServiceStatus) => void): void
    }

    interface NearbySearchRequest {
      location: google.maps.LatLng | google.maps.LatLngLiteral
      radius: number
      type?: string
    }

    interface DetailsRequest {
      placeId: string
      fields: string[]
    }

    enum PlacesServiceStatus {
      OK = "OK",
    }
  }
}

// Ensure google is available globally
declare global {
  interface Window {
    google: typeof google
  }
}

