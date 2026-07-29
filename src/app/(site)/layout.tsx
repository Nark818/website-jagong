import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { createClient } from "@/lib/supabase/server";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Nav isAdmin={!!user} />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
