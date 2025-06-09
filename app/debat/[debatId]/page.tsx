export default function DebatDetailPage({
  params,
}: {
  params: {
    debatId: string;
  };
}) {
  return <div>detail debat page {params.debatId}</div>;
}
