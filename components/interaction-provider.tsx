"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import type { PublicSiteConfig } from "../lib/config";
import { legalText, legalTitle, type LegalKind } from "../lib/legal";
import {
  initialRequest,
  isServiceTopic,
  requestReducer,
  type RequestTopic,
} from "../lib/request";
import { Dialog } from "./dialog";
import { RequestDialog } from "./request-dialog";
import { RevealEffects } from "./reveal-effects";

interface InteractionActions {
  openRequest: (topic: RequestTopic) => void;
  openLegal: (kind: LegalKind) => void;
}

const InteractionContext = createContext<InteractionActions | null>(null);

function useInteractions(): InteractionActions {
  const actions = useContext(InteractionContext);
  if (!actions) throw new Error("InteractionProvider is required.");
  return actions;
}

export function RequestButton({
  topic,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { topic: RequestTopic }) {
  const { openRequest } = useInteractions();
  return (
    <button
      {...props}
      type={props.type || "button"}
      onClick={() => openRequest(topic)}
    >
      {children}
    </button>
  );
}

export function LegalButton({
  kind,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { kind: LegalKind }) {
  const { openLegal } = useInteractions();
  return (
    <button
      {...props}
      type="button"
      data-legal={kind}
      onClick={() => openLegal(kind)}
    >
      {children}
    </button>
  );
}

export function InteractionProvider({
  config,
  children,
}: {
  config: PublicSiteConfig;
  children: ReactNode;
}) {
  const [request, dispatch] = useReducer(
    requestReducer,
    config,
    initialRequest,
  );
  const [legal, setLegal] = useState<LegalKind | null>(null);
  useEffect(() => {
    const service = new URLSearchParams(window.location.search).get("service");
    if (isServiceTopic(service)) dispatch({ type: "open", topic: service });
  }, []);

  return (
    <InteractionContext.Provider
      value={{
        openRequest: (topic) => dispatch({ type: "open", topic }),
        openLegal: setLegal,
      }}
    >
      {children}
      <RevealEffects />
      <RequestDialog config={config} state={request} dispatch={dispatch} />
      <Dialog
        open={legal !== null}
        onClose={() => setLegal(null)}
        id="legal-dialog"
        labelledBy="legal-title"
      >
        <h2 id="legal-title">{legal ? legalTitle(legal) : ""}</h2>
        <div id="legal-content" className="legal-content">
          {legal ? legalText(legal, config) : ""}
        </div>
      </Dialog>
    </InteractionContext.Provider>
  );
}
