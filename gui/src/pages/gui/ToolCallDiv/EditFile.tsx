import { getMarkdownLanguageTagForFile } from "core/util";
import { useMemo } from "react";
import StyledMarkdownPreview from "../../../components/markdown/StyledMarkdownPreview";
import AcceptRejectAllButtons from "../../../components/StepContainer/AcceptRejectAllButtons";
import { useAppSelector } from "../../../redux/hooks";

type EditToolCallProps = {
  relativeFilePath: string;
  newContents: string;
  toolCallId?: string;
};

export function EditFile(props: EditToolCallProps) {
  const src = `\`\`\`${getMarkdownLanguageTagForFile(props.relativeFilePath ?? "test.txt")} ${props.relativeFilePath}\n${props.newContents ?? ""}\n\`\`\``;

  const isStreaming = useAppSelector((state) => state.session.isStreaming);
  const states = useAppSelector((store) => store.session.codeBlockApplyStates);

  const applyState = useMemo(() => {
    return states.states.find(
      (state) => state.toolCallId && state.toolCallId === props.toolCallId,
    );
  }, [states, props.toolCallId]);

  if (!props.relativeFilePath) {
    return null;
  }

  return (
    <>
      <StyledMarkdownPreview
        isRenderingInStepContainer={true}
        source={src}
        disableManualApply={true}
        singleCodeblockStreamId={applyState?.streamId}
        expandCodeblocks={false}
      />
      {/* TODO better indicator of generation at bottom */}
      {/* {isStreaming && applyState?.status === "streaming" && (
        <div className={`m-2 flex items-center justify-center`}>
          Generating...
        </div>
      )} */}
      {!isStreaming && applyState?.status === "done" && (
        <div className={`m-2 flex items-center justify-center`}>
          <AcceptRejectAllButtons
            pendingApplyStates={[applyState]}
            onAcceptOrReject={async (outcome) => {}}
          />
        </div>
      )}
    </>
  );
}
