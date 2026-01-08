#!/bin/bash

set -e  # Exit on error

echo "Building Docker image..."

docker build \
  --build-arg NEXT_PUBLIC_API="https://api.venu.uz" \
  --build-arg NEXTAUTH_URL="https://venu.uz" \
  --build-arg NEXTAUTH_SECRET="u%F&BT^&O*()<_>+P>+<)(*NHY&BGTY%FRFgthy)" \
  --build-arg NEXT_PUBLIC_YANDEX_MAPS_API_KEY="2abfe0ab-2d42-40c3-afad-e74cb318f0d6" \
  --build-arg NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyAIGcxzdZOn9GbY4bPBlf4WIAS0HeCge5k" \
  -t muhiddin0/venu-frontend .

echo "Build completed successfully!"
echo ""
echo "Pushing Docker image..."

docker push muhiddin0/venu-frontend

echo "Push completed successfully!"
