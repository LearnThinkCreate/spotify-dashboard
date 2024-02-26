import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Dashboard from "@/ui/Dashboard";



export default async function Page(
) {
  return (
    <>
      <Breadcrumb pageName="Spotify History" />

      <Dashboard />
    </>
  );
};
