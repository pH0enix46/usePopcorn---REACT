// // //
import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          // ⏺ code is a property of the keyboard event (e) that gives the physical key code of the key pressed, like "Escape", "Enter" etc
          action();
        }
      }

      document.addEventListener("keydown", callback);

      // ⏺ cleanup function
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [action, key]
  );
}
