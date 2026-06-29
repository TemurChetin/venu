import { Carousel } from "@/features/home/carousel";
import { BottomBanners } from "@/features/home/bottom-banners";
import DiscountProducts from "@/features/home/discount";
import Seasonal from "@/features/home/seasonal";
import Latest from "@/features/home/latest";
import MainSectionBanner from "@/features/home/main-section-banner";
import NewArrival from "@/features/home/newArrival";
import TopRated from "@/features/home/topRated";
import BestSell from "@/features/home/bestSell";
import Featured from "@/features/home/featured";
import Brands from "@/features/home/brands";
import { LazySection } from "@/components/common/lazy";
import {
  BannerSkleton,
  BrandSkleton,
  HomeSkleton,
} from "@/components/common/homeSkleton";

type Props = {
  limit: number;
  offset: number;
};

function Page({}: Props) {
  return (
    <>
      <Carousel />

      {/* Discount Products */}
      <DiscountProducts />

      {/* Seasonal Products */}
      <LazySection skeleton={<HomeSkleton />}>
        <Seasonal />
      </LazySection>

      {/* Latest Products */}
      <LazySection skeleton={<HomeSkleton />}>
        <Latest />
      </LazySection>

      {/* Main Section Banner 1 */}
      <LazySection skeleton={<BannerSkleton />}>
        <MainSectionBanner />
      </LazySection>

      {/* New Arrival Products */}
      <LazySection skeleton={<HomeSkleton />}>
        <NewArrival />
      </LazySection>

      {/* Top Rated Products */}
      <LazySection skeleton={<HomeSkleton />}>
        <TopRated />
      </LazySection>

      {/* Main Section Banner 2 */}
      <LazySection skeleton={<BannerSkleton />}>
        <MainSectionBanner />
      </LazySection>

      {/* Best Selling Products */}
      <LazySection skeleton={<HomeSkleton />}>
        <BestSell />
      </LazySection>

      {/* Featured Products */}
      <LazySection skeleton={<HomeSkleton />}>
        <Featured />
      </LazySection>

      {/* Brands Section */}
      <LazySection skeleton={<BrandSkleton />}>
        <Brands />
      </LazySection>

      {/* Additional Main Section Banners */}
      <LazySection skeleton={<BannerSkleton />}>
        <MainSectionBanner />
      </LazySection>

      <BottomBanners />
    </>
  );
}

export default Page;
