import PortfolioRedesign from '../components/PortfolioRedesign';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';

export default function Home() {
  useSEO(SEO_CONFIGS.home);

  return (
    <PortfolioRedesign />
  );
}
