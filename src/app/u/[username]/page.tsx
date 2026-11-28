import { permanentRedirect } from "next/navigation";

interface PageProps {
  params: {
    username: string;
  };
}

export default function LegacyMemberPortfolioRedirect({ params }: PageProps) {
  permanentRedirect(`/portfolio/${encodeURIComponent(params.username)}`);
}
