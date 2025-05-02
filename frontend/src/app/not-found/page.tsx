// import { headers } from "next/headers";

import { NotFoundWidget } from "@/widgets/not-found";

export default async function NotFound() {
  // const headersList = await headers();
  // const domain = headersList.get("host");
  return <NotFoundWidget />;
}
