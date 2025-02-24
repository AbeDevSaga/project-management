import { sections } from "../constants/section";

interface SectionProps {
  sectionKey: keyof typeof sections;
}

const SectionHeader = ({ sectionKey }: SectionProps) => {
  const { headline, section } = sections[sectionKey];

  return (
    <div className="w-full mx-auto">
      <h2 className="text-left text-primary font-bold">{section}</h2>
    </div>
  );
};

export default SectionHeader;