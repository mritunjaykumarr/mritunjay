type AdUnitProps = {
  slot: string;
  format?: string;
  style?: React.CSSProperties;
  className?: string;
  label?: string;
};

export default function AdUnit(_props: AdUnitProps) {
  // Disabled on portfolio so Google AdSense focuses 100% on toolout.online
  return null;
}
