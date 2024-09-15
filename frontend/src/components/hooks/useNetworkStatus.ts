"use client";
import { useState, useEffect } from "react";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

const fetchWithTimeout = async (
  resource: RequestInfo | URL,
  options: FetchOptions = {}
) => {
  const { timeout = 5000 } = options; // Set a default timeout of 5 seconds

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : false
  );

  const checkOnlineStatus = async () => {
    // Use a URL that you expect to be always available and responds quickly
    const onlineCheckUrl = "/images/leightWeightImage.png";
    try {
      // Attempt to fetch with cache bypass to ensure live status
      const response = await fetchWithTimeout(onlineCheckUrl, {
        method: "HEAD",
        cache: "no-cache",
      });
      setIsOnline(response.ok);
    } catch (error) {
      // If fetch fails, network might be down
      setIsOnline(false);
    }
  };

  useEffect(() => {
    // Set an interval for periodic network status checks
    const intervalId = setInterval(checkOnlineStatus, 5000);

    // Perform an immediate check on mount
    checkOnlineStatus();

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Handler for receiving messages
    const handleServiceWorkerMessage = (event: {
      data: {
        isOnline: boolean | ((prevState: boolean) => boolean) | undefined;
      };
    }) => {
      if (event.data.isOnline !== undefined) {
        setIsOnline(event.data.isOnline);
      }
    };

    // Add event listener for messages from service worker
    navigator.serviceWorker.addEventListener(
      "message",
      handleServiceWorkerMessage
    );

    // Cleanup
    return () =>
      navigator.serviceWorker.removeEventListener(
        "message",
        handleServiceWorkerMessage
      );
  }, []);

  return isOnline;
};
