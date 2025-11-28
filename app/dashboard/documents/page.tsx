"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Button, Card, CardBody, Input, Select, SelectItem } from "@nextui-org/react";
import { Bold, Italic, List, ListOrdered, Save, Send } from "lucide-react";
import { useState } from "react";

export default function DocumentSubmission() {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: "Start typing your resolution, bill, or position paper here...",
            }),
        ],
        content: "",
        editorProps: {
            attributes: {
                class: "prose dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4",
            },
        },
    });

    if (!editor) {
        return null;
    }

    const handleSave = () => {
        const content = editor.getHTML();
        console.log("Saving draft:", { title, type, content });
        alert("Draft saved!");
    };

    const handleSubmit = () => {
        const content = editor.getHTML();
        console.log("Submitting:", { title, type, content });
        alert("Document submitted successfully!");
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Submit Documents</h1>
                <p className="text-gray-500">Draft and submit your bills, resolutions, and position papers.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardBody className="p-0">
                            {/* Toolbar */}
                            <div className="border-b border-gray-200 dark:border-white/10 p-2 flex gap-1 flex-wrap bg-gray-50 dark:bg-white/5">
                                <Button
                                    isIconOnly
                                    variant={editor.isActive("bold") ? "solid" : "light"}
                                    size="sm"
                                    onPress={() => editor.chain().focus().toggleBold().run()}
                                >
                                    <Bold size={18} />
                                </Button>
                                <Button
                                    isIconOnly
                                    variant={editor.isActive("italic") ? "solid" : "light"}
                                    size="sm"
                                    onPress={() => editor.chain().focus().toggleItalic().run()}
                                >
                                    <Italic size={18} />
                                </Button>
                                <div className="w-px h-6 bg-gray-300 dark:bg-white/20 mx-1 self-center" />
                                <Button
                                    isIconOnly
                                    variant={editor.isActive("bulletList") ? "solid" : "light"}
                                    size="sm"
                                    onPress={() => editor.chain().focus().toggleBulletList().run()}
                                >
                                    <List size={18} />
                                </Button>
                                <Button
                                    isIconOnly
                                    variant={editor.isActive("orderedList") ? "solid" : "light"}
                                    size="sm"
                                    onPress={() => editor.chain().focus().toggleOrderedList().run()}
                                >
                                    <ListOrdered size={18} />
                                </Button>
                            </div>

                            {/* Editor Area */}
                            <EditorContent editor={editor} />
                        </CardBody>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardBody className="p-6 space-y-4">
                            <h3 className="font-semibold">Document Details</h3>
                            <Input
                                label="Title"
                                placeholder="e.g. Draft Resolution 1.0"
                                value={title}
                                onValueChange={setTitle}
                            />
                            <Select
                                label="Type"
                                placeholder="Select Type"
                                selectedKeys={type ? [type] : []}
                                onChange={(e) => setType(e.target.value)}
                            >
                                <SelectItem key="resolution">Draft Resolution</SelectItem>
                                <SelectItem key="position_paper">Position Paper</SelectItem>
                                <SelectItem key="bill">Private Member Bill</SelectItem>
                                <SelectItem key="amendment">Amendment</SelectItem>
                            </Select>

                            <div className="pt-4 space-y-2">
                                <Button
                                    fullWidth
                                    color="primary"
                                    startContent={<Send size={18} />}
                                    onPress={handleSubmit}
                                >
                                    Submit Document
                                </Button>
                                <Button
                                    fullWidth
                                    variant="flat"
                                    startContent={<Save size={18} />}
                                    onPress={handleSave}
                                >
                                    Save Draft
                                </Button>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                        <CardBody className="p-4">
                            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Submission Guidelines</h4>
                            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1 list-disc list-inside">
                                <li>Use formal language.</li>
                                <li>Cite sources where applicable.</li>
                                <li>Respect the word limit (if any).</li>
                                <li>Drafts are auto-saved locally.</li>
                            </ul>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
