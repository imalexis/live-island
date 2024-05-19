import { useCallback, useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/web";

type LiveIslandStatus = "pending" | "failed" | "success";
type Props = {
  ws: string;
  duration?: number;
  dismiss?: "passive" | "proactive";
};
export default function LiveIsland({
  ws,
  duration = 5000,
  dismiss = "passive",
}: Props) {
  const [springs, api] = useSpring(() => ({ from: { top: -100 } }));
  const [status, setStatus] = useState<LiveIslandStatus>("pending");
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const onOpen = useCallback((event: Event) => {
    setStatus("success");
  }, []);
  const showUp = useCallback(() => {
    api.start({
      from: {
        top: -100,
      },
      to: {
        top: 20,
      },
    });
  }, [api]);
  const hide = useCallback(() => {
    api.start({
      from: {
        top: 20,
      },
      to: {
        top: -100,
      },
    });
  }, [api]);
  const onMessage = useCallback(
    (event: MessageEvent) => {
      setActiveMessage(event.data);
      showUp();
      if (dismiss === "passive") {
        setTimeout(() => {
          hide();
        }, duration);
      }
    },
    [showUp, hide, duration, dismiss]
  );
  const onError = useCallback((event: Event) => {
    setStatus("failed");
  }, []);
  useEffect(() => {
    const socket = new WebSocket(ws);
    socket.addEventListener("open", onOpen);
    socket.addEventListener("message", onMessage);
    socket.addEventListener("error", onError);
    return () => {
      socket.close();
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("message", onMessage);
      socket.removeEventListener("error", onError);
    };
  }, [onOpen, onError, onMessage, ws]);

  const closeHandler = () => {
    hide();
  };
  return (
    <animated.div
      style={{
        position: "absolute",
        left: "calc(50vw - 75px)",
        width: "150px",
        height: "50px",
        backgroundColor: "lightblue",
        ...springs,
      }}
    >
      {status === "pending" && <span>Connecting</span>}
      {status === "failed" && <span>Encounting error</span>}
      {status === "success" && (
        <div>
          <span>{activeMessage}</span>
          <button onClick={closeHandler}>Close</button>
        </div>
      )}
    </animated.div>
  );
}
