"use client";

import { PhoneAuthModal } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { sendSupportChatMessage } from "@/services/requests/chat";
import { MessageCircle, SendHorizontal, X } from "lucide-react";
import { getSession, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";

type ChatMessage = { role: "user" | "assistant"; text: string };

export function SupportChatWidget() {
  const t = useTranslations("supportChat");
  const { data: session, status } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const pendingOpenRef = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);

  const userId =
    session?.user?.id != null ? String(session.user.id) : "";

  useLayoutEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending, open]);

  useEffect(() => {
    if (status !== "authenticated" || !userId) return;
    if (!pendingOpenRef.current) return;
    pendingOpenRef.current = false;
    setOpen(true);
  }, [status, userId]);

  useEffect(() => {
    if (status === "unauthenticated") {
      setOpen(false);
      setMessages([]);
    }
  }, [status]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !userId || sending) return;

      setInput("");
      setMessages((m) => [...m, { role: "user", text: trimmed }]);
      setSending(true);
      try {
        const data = await sendSupportChatMessage(trimmed);
        setMessages((m) => [
          ...m,
          { role: "assistant", text: data.answer || "" },
        ]);
      } catch {
        setMessages((m) => [
          ...m,
          { role: "assistant", text: t("sendError") },
        ]);
      } finally {
        setSending(false);
      }
    },
    [userId, sending, t]
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  return (
    <>
      <PhoneAuthModal
        open={authOpen}
        onOpenChange={async (next) => {
          if (!next) {
            const s = await getSession();
            if (!s?.user?.id) {
              pendingOpenRef.current = false;
            }
          }
          setAuthOpen(next);
        }}
      />

      <div
        className={cn(
          "fixed z-100 flex flex-col items-end gap-3",
          open
            ? "inset-0 sm:inset-auto sm:bottom-[70px] sm:right-[15px]"
            : "bottom-[70px] right-[15px]"
        )}
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        {open && (
          <div
            className={cn(
              "flex flex-col overflow-hidden",
              "h-full w-full sm:h-auto sm:w-[380px] md:w-[400px] lg:w-[420px]",
              "sm:rounded-2xl",
              "border border-border bg-background shadow-xl"
            )}
            role="dialog"
            aria-label={t("title")}
          >
            <div
              className="flex items-start justify-between gap-3 px-4 py-3 text-white !bg-primary"
              style={{ backgroundColor: "#35cce6" }}
            >
              <div className="min-w-0">
                <h2 className="text-base font-semibold leading-tight">
                  {t("title")}
                </h2>
                <p className="mt-0.5 text-xs text-white/90">{t("subtitle")}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-white hover:bg-white/20 hover:text-white"
                onClick={() => setOpen(false)}
                aria-label={t("closeChat")}
              >
                <X className="size-5" />
              </Button>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-muted/30 px-3 py-3 sm:flex-none sm:max-h-[min(420px,50vh)] md:max-h-[min(500px,55vh)] lg:max-h-[min(560px,60vh)]">
              {messages.length === 0 && (
                <p className="px-1 text-center text-sm text-muted-foreground">
                  {t("subtitle")}
                </p>
              )}
              {messages.map((msg, i) => (
                <div
                  key={`${i}-${msg.role}`}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm wrap-break-word",
                      msg.role === "user"
                        ? "whitespace-pre-wrap rounded-br-md bg-[#a3eaf7] text-foreground"
                        : "rounded-bl-md bg-muted text-foreground [&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mt-0.5 [&_p]:mt-1 [&_p:first-child]:mt-0 [&_a]:text-blue-600 [&_a]:underline [&_strong]:font-semibold"
                    )}
                  >
                    {msg.role === "assistant" ? (
                      <ReactMarkdown
                        components={{
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                    …
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={onSubmit}
              className="flex gap-2 border-t border-border bg-background p-3 sm:p-3 md:p-4"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("placeholder")}
                disabled={sending}
                className="rounded-xl"
                autoComplete="off"
              />
              <Button
                type="submit"
                size="icon"
                className="shrink-0 rounded-xl"
                disabled={sending || !input.trim()}
                aria-label={t("send")}
              >
                <SendHorizontal className="size-4" />
              </Button>
            </form>
          </div>
        )}

        <button
          type="button"
          className={cn(
            "flex size-[45px] cursor-pointer items-center justify-center rounded-full sm:size-[50px] lg:size-[52px]",
            "border-0 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]",
            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none !bg-primary",
            open && "max-sm:hidden"
          )}
          style={{
            backgroundColor: "#35cce6",
            boxShadow: "0 2px 10px 1px #b5b5b5",
          }}
          onClick={() => {
            if (status !== "authenticated" || !userId) {
              pendingOpenRef.current = true;
              setAuthOpen(true);
              return;
            }
            setOpen((v) => !v);
          }}
          aria-expanded={open}
          aria-label={open ? t("closeChat") : t("openChat")}
        >
          <MessageCircle
            size={28}
            color="#fff"
            strokeWidth={2}
            aria-hidden
          />
        </button>
      </div>
    </>
  );
}
