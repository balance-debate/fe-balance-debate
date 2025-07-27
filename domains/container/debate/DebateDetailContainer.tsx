import { useState, useEffect } from "react";
import { DebateDetailContent } from "../../presentational/debate/DebateDetailContent";
import { DebateDetailStats } from "../../presentational/debate/DebateDetailStats";
import { CommentSection } from "../../presentational/debate/CommentSection";
import { Toast } from "../../presentational/common/Toast";
import {
  fetchDebateDetail,
  fetchHasVote,
  submitVote,
  fetchVoteResults,
} from "@/lib/api";
import { type DebateFromAPI } from "../../presentational/debate/types";

interface DebateDetailContainerProps {
  debateId: string;
}

export function DebateDetailContainer({
  debateId,
}: DebateDetailContainerProps) {
  const [selectedSide, setSelectedSide] = useState<"left" | "right" | null>(
    null
  );
  const [debate, setDebate] = useState<DebateFromAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasVote, setHasVote] = useState<boolean | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [voteResults, setVoteResults] = useState<{
    choiceACount: number;
    choiceBCount: number;
  } | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  useEffect(() => {
    const loadDebateAndVoteStatus = async () => {
      try {
        setIsLoading(true);

        // 토론 정보, 투표 여부, 투표 결과를 병렬로 로드
        const [debateData, voteStatus, results] = await Promise.all([
          fetchDebateDetail(debateId),
          fetchHasVote(debateId),
          fetchVoteResults(debateId),
        ]);

        setDebate(debateData);
        setHasVote(voteStatus.hasVote);
        setVoteResults(results);

        // 이미 투표했다면 선택된 상태로 설정
        if (voteStatus.hasVote) {
          setSelectedSide("left"); // 기본값으로 설정 (실제로는 서버에서 투표 정보를 가져와야 함)
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "토론을 불러오는데 실패했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDebateAndVoteStatus();
  }, [debateId]);

  const handleSelectSide = async (side: "left" | "right") => {
    if (isVoting || hasVote) return;

    setSelectedSide(side);
    setIsVoting(true);

    try {
      const target = side === "left" ? "CHOICE_A" : "CHOICE_B";
      await submitVote(debateId, target);

      setHasVote(true);
      setToast({
        message: "투표가 완료되었습니다!",
        type: "success",
        isVisible: true,
      });

      // 투표 결과 새로고침
      const newResults = await fetchVoteResults(debateId);
      setVoteResults(newResults);
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "투표에 실패했습니다.",
        type: "error",
        isVisible: true,
      });
      setSelectedSide(null); // 투표 실패 시 선택 해제
    } finally {
      setIsVoting(false);
    }
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">토론을 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <DebateDetailContent
          title={debate.topic}
          thumbnail={debate.thumbnailUrl}
          choiceA={debate.choiceA}
          choiceB={debate.choiceB}
          onSelectSide={handleSelectSide}
          selectedSide={selectedSide}
          hasVote={hasVote}
          isVoting={isVoting}
        />

        <div className="relative">
          {selectedSide === null ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-200">
              <p className="text-lg font-medium text-gray-600">
                투표 후에 결과를 확인할 수 있습니다
              </p>
            </div>
          ) : null}
          <div className={selectedSide === null ? "pointer-events-none" : ""}>
            <DebateDetailStats
              agreeCount={voteResults?.choiceACount || 0}
              disagreeCount={voteResults?.choiceBCount || 0}
            />
          </div>
        </div>

        {/* 댓글 섹션 */}
        <CommentSection debateId={parseInt(debateId)} />
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </>
  );
}
