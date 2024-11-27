/**
 * 단축키 감지
 * Submit forms on CTRL + Enter or CMD + Enter
 *
 * Usage: <Form onKeyDown={onKeyboardEvent(...)} />
 * - We have to use onKeyDown, otherwise the metaKey is not set on Mac
 *
 */
export function onKeyboardEvent(func) {
    return (e) => {
        //ctrl + z 감지
      if ((e.key === "z"||e.key === "ㅋ") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();         //원래 있었던 ctrl+z의 undo 기능을 중지
        func();
      }
    };
}