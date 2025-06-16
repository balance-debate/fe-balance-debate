import { Header } from "@/domains/common/Header";
import DebatListContainer from "@/domains/container/DebatListContainer";

export default function DebatPage() {
  return (
    <>
      <Header title="토론 목록" />
      <DebatListContainer />
    </>
  );
}
