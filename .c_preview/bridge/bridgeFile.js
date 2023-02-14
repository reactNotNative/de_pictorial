import { render } from "../preset/react.js";
export const bridgeData = {
    "workspaceFolder": "file:///c%3A/projects/de_pictorial",
    "serverRootDir": "",
    "previewFolderRelPath": "preview",
    "activeFileRelPath": "Frontend/components/Card.jsx",
    "mapFileRelPath": "Frontend/components/Card.jsx",
    "presetName": "react",
    "workspaceFolderName": "de_pictorial"
};
export const preview = () => render(getMod);
const getMod = () => import("../../Frontend/components/Card.jsx");