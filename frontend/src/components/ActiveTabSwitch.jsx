import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
    const { activeTab, setActiveTab } = useChatStore();

    const tabClass = (tab) =>
        `px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
            activeTab === tab
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-slate-400 hover:text-slate-200"
        }`;

    return (
        <div className="flex items-center bg-slate-800/70 p-1 rounded-2xl w-fit m-2">
            <button
                onClick={() => setActiveTab("chats")}
                className={tabClass("chats")}>
                Chats
            </button>

            <button
                onClick={() => setActiveTab("contacts")}
                className={tabClass("contacts")}>
                Contacts
            </button>
        </div>
    );
}

export default ActiveTabSwitch;
