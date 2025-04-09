/**
 * Utility functions for working with CesiumJS
 */

// Check if Cesium is available
export function isCesiumAvailable(): boolean {
  return typeof window !== "undefined" && "Cesium" in window
}

// Check if Cesium Ion token is available
export function hasCesiumIonToken(): boolean {
  return !!process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN
}

// Get Cesium Ion token
export function getCesiumIonToken(): string {
  return process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN || ""
}

// Create a Cesium entity for a location
export function createLocationEntity(cesium: any, position: any, name: string, description?: string): any {
  return new cesium.Entity({
    position,
    name,
    description,
    billboard: {
      image: cesium.buildModuleUrl("Assets/Textures/pin.png"),
      verticalOrigin: cesium.VerticalOrigin.BOTTOM,
      heightReference: cesium.HeightReference.RELATIVE_TO_GROUND,
    },
    label: {
      text: name,
      font: "14pt sans-serif",
      style: cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      verticalOrigin: cesium.VerticalOrigin.TOP,
      pixelOffset: new cesium.Cartesian2(0, -30),
    },
  })
}

// Create a Cesium entity for a route
export function createRouteEntity(cesium: any, positions: any[], name: string, color = cesium.Color.BLUE): any {
  return new cesium.Entity({
    name,
    polyline: {
      positions,
      width: 5,
      material: color,
      clampToGround: true,
    },
  })
}

// Convert latitude and longitude to Cesium Cartesian3
export function latLongToCartesian3(cesium: any, latitude: number, longitude: number, height = 0): any {
  return cesium.Cartesian3.fromDegrees(longitude, latitude, height)
}

// Calculate distance between two points in meters
export function calculateDistance(cesium: any, point1: any, point2: any): number {
  return cesium.Cartesian3.distance(point1, point2)
}

// Convert Cesium Cartesian3 to latitude and longitude
export function cartesian3ToLatLong(
  cesium: any,
  position: any,
): { latitude: number; longitude: number; height: number } {
  const cartographic = cesium.Cartographic.fromCartesian(position)
  return {
    latitude: cesium.Math.toDegrees(cartographic.latitude),
    longitude: cesium.Math.toDegrees(cartographic.longitude),
    height: cartographic.height,
  }
}

