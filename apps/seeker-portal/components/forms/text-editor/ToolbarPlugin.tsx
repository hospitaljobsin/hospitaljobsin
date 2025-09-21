import { Button, Divider, Dropdown, DropdownItem } from '@heroui/react';
import { $createCodeNode, $isCodeNode, CODE_LANGUAGE_FRIENDLY_NAME_MAP, CODE_LANGUAGE_MAP } from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
	$isListNode,
	INSERT_CHECK_LIST_COMMAND,
	INSERT_ORDERED_LIST_COMMAND,
	INSERT_UNORDERED_LIST_COMMAND,
	ListNode,
	REMOVE_LIST_COMMAND
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, type HeadingTagType } from '@lexical/rich-text';
import { $getSelectionStyleValueForProperty, $isParentElementRTL, $patchStyleText, $setBlocksType } from '@lexical/selection';
import { $findMatchingParent, $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
	$createParagraphNode,
	$getNodeByKey,
	$getSelection,
	$isRangeSelection,
	$isRootOrShadowRoot,
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	COMMAND_PRIORITY_CRITICAL,
	FORMAT_ELEMENT_COMMAND,
	FORMAT_TEXT_COMMAND,
	REDO_COMMAND,
	SELECTION_CHANGE_COMMAND,
	UNDO_COMMAND,
	type LexicalEditor,
	type NodeKey
} from 'lexical';
import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	Bold,
	CheckSquare,
	Code,
	Heading1,
	Heading2,
	Heading3,
	Italic,
	Link,
	List,
	ListOrdered,
	Quote,
	Redo,
	Type,
	Underline,
	Undo
} from 'lucide-react';
import { useCallback, useEffect, useState, type JSX } from 'react';
import { getSelectedNode } from './utils/getSelectedNode';
import { sanitizeUrl } from './utils/url';

const blockTypeToBlockName = {
	bullet: 'Bulleted List',
	check: 'Check List',
	code: 'Code Block',
	h1: 'Heading 1',
	h2: 'Heading 2',
	h3: 'Heading 3',
	h4: 'Heading 4',
	h5: 'Heading 5',
	h6: 'Heading 6',
	number: 'Numbered List',
	paragraph: 'Normal',
	quote: 'Quote'
};

function getCodeLanguageOptions(): [string, string][] {
	const options: [string, string][] = [];

	for (const [lang, friendlyName] of Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP)) {
		options.push([lang, friendlyName]);
	}

	return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

const FONT_FAMILY_OPTIONS: [string, string][] = [
	['Arial', 'Arial'],
	['Courier New', 'Courier New'],
	['Georgia', 'Georgia'],
	['Times New Roman', 'Times New Roman'],
	['Trebuchet MS', 'Trebuchet MS'],
	['Verdana', 'Verdana']
];

const FONT_SIZE_OPTIONS: [string, string][] = [
	['10px', '10px'],
	['11px', '11px'],
	['12px', '12px'],
	['13px', '13px'],
	['14px', '14px'],
	['15px', '15px'],
	['16px', '16px'],
	['17px', '17px'],
	['18px', '18px'],
	['19px', '19px'],
	['20px', '20px']
];

function dropDownActiveClass(active: boolean) {
	if (active) return 'active dropdown-item-active';
	else return '';
}

function BlockFormatDropDown({
	editor,
	blockType,
	isDisabled = false
}: {
	blockType: keyof typeof blockTypeToBlockName;
	editor: LexicalEditor;
	isDisabled?: boolean;
}): JSX.Element {
	const formatParagraph = () => {
		editor.update(() => {
			const selection = $getSelection();
			if ($isRangeSelection(selection)) {
				$setBlocksType(selection, () => $createParagraphNode());
			}
		});
	};

	const formatHeading = (headingSize: HeadingTagType) => {
		if (blockType !== headingSize) {
			editor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					$setBlocksType(selection, () => $createHeadingNode(headingSize));
				}
			});
		}
	};

	const formatBulletList = () => {
		if (blockType !== 'bullet') {
			editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatCheckList = () => {
		if (blockType !== 'check') {
			editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatNumberedList = () => {
		if (blockType !== 'number') {
			editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
		} else {
			editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
		}
	};

	const formatQuote = () => {
		if (blockType !== 'quote') {
			editor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					$setBlocksType(selection, () => $createQuoteNode());
				}
			});
		}
	};

	const formatCode = () => {
		if (blockType !== 'code') {
			editor.update(() => {
				let selection = $getSelection();

				if ($isRangeSelection(selection)) {
					if (selection.isCollapsed()) {
						$setBlocksType(selection, () => $createCodeNode());
					} else {
						const textContent = selection.getTextContent();
						const codeNode = $createCodeNode();
						selection.insertNodes([codeNode]);
						selection = $getSelection();
						if ($isRangeSelection(selection)) selection.insertRawText(textContent);
					}
				}
			});
		}
	};

	return (
		<Dropdown isDisabled={isDisabled}>
			<DropdownItem key={'paragraph'} className={'item ' + dropDownActiveClass(blockType === 'paragraph')} onClick={formatParagraph}>
				<Type className='icon paragraph' />
				<span className='text'>Normal</span>
			</DropdownItem>
			<DropdownItem key={'h1'} className={'item ' + dropDownActiveClass(blockType === 'h1')} onClick={() => formatHeading('h1')}>
				<Heading1 className='icon h1' />
				<span className='text'>Heading 1</span>
			</DropdownItem>
			<DropdownItem key={'h2'} className={'item ' + dropDownActiveClass(blockType === 'h2')} onClick={() => formatHeading('h2')}>
				<Heading2 className='icon h2' />
				<span className='text'>Heading 2</span>
			</DropdownItem>
			<DropdownItem key={'h3'} className={'item ' + dropDownActiveClass(blockType === 'h3')} onClick={() => formatHeading('h3')}>
				<Heading3 className='icon h3' />
				<span className='text'>Heading 3</span>
			</DropdownItem>
			<DropdownItem key={'bullet'} className={'item ' + dropDownActiveClass(blockType === 'bullet')} onClick={formatBulletList}>
				<List className='icon bullet-list' />
				<span className='text'>Bullet List</span>
			</DropdownItem>
			<DropdownItem key={'number'} className={'item ' + dropDownActiveClass(blockType === 'number')} onClick={formatNumberedList}>
				<ListOrdered className='icon numbered-list' />
				<span className='text'>Numbered List</span>
			</DropdownItem>
			<DropdownItem key={'check'} className={'item ' + dropDownActiveClass(blockType === 'check')} onClick={formatCheckList}>
				<CheckSquare className='icon check-list' />
				<span className='text'>Check List</span>
			</DropdownItem>
			<DropdownItem key={'quote'} className={'item ' + dropDownActiveClass(blockType === 'quote')} onClick={formatQuote}>
				<Quote className='icon quote' />
				<span className='text'>Quote</span>
			</DropdownItem>
			<DropdownItem key={'code'} className={'item ' + dropDownActiveClass(blockType === 'code')} onClick={formatCode}>
				<Code className='icon code' />
				<span className='text'>Code Block</span>
			</DropdownItem>
		</Dropdown>
	);
}

function FontDropDown({
	editor,
	value,
	style,
	isDisabled = false
}: {
	editor: LexicalEditor;
	value: string;
	style: string;
	isDisabled?: boolean;
}): JSX.Element {
	const handleClick = useCallback(
		(option: string) => {
			editor.update(() => {
				const selection = $getSelection();
				if ($isRangeSelection(selection)) {
					$patchStyleText(selection, {
						[style]: option
					});
				}
			});
		},
		[editor, style]
	);

	const buttonAriaLabel = style === 'font-family' ? 'Formatting options for font family' : 'Formatting options for font size';

	return (
		<Dropdown isDisabled={isDisabled}>
			{(style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(([option, text]) => (
				<DropdownItem
					className={`item ${dropDownActiveClass(value === option)} ${style === 'font-size' ? 'fontsize-item' : ''}`}
					onClick={() => handleClick(option)}
					key={option}
				>
					<span className='text'>{text}</span>
				</DropdownItem>
			))}
		</Dropdown>
	);
}

export default function ToolbarPlugin(): JSX.Element {
	const [editor] = useLexicalComposerContext();
	const [activeEditor, setActiveEditor] = useState(editor);
	const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph');
	const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null);
	const [fontSize, setFontSize] = useState<string>('15px');
	const [fontColor, setFontColor] = useState<string>('#000');
	const [bgColor, setBgColor] = useState<string>('#fff');
	const [fontFamily, setFontFamily] = useState<string>('Arial');
	const [isLink, setIsLink] = useState(false);
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);
	const [isStrikethrough, setIsStrikethrough] = useState(false);
	const [isSubscript, setIsSubscript] = useState(false);
	const [isSuperscript, setIsSuperscript] = useState(false);
	const [isCode, setIsCode] = useState(false);
	const [canUndo, setCanUndo] = useState(false);
	const [canRedo, setCanRedo] = useState(false);
	//   const [modal, showModal] = useModal();
	const [isRTL, setIsRTL] = useState(false);
	const [codeLanguage, setCodeLanguage] = useState<string>('');
	const [isEditable, setIsEditable] = useState(() => editor.isEditable());
	const IS_APPLE = false;

	const updateToolbar = useCallback(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			const anchorNode = selection.anchor.getNode();
			let element =
				anchorNode.getKey() === 'root'
					? anchorNode
					: $findMatchingParent(anchorNode, e => {
							const parent = e.getParent();
							return parent !== null && $isRootOrShadowRoot(parent);
						});

			if (element === null) {
				element = anchorNode.getTopLevelElementOrThrow();
			}

			const elementKey = element.getKey();
			const elementDOM = activeEditor.getElementByKey(elementKey);

			// Update text format
			setIsBold(selection.hasFormat('bold'));
			setIsItalic(selection.hasFormat('italic'));
			setIsUnderline(selection.hasFormat('underline'));
			setIsStrikethrough(selection.hasFormat('strikethrough'));
			setIsSubscript(selection.hasFormat('subscript'));
			setIsSuperscript(selection.hasFormat('superscript'));
			setIsCode(selection.hasFormat('code'));
			setIsRTL($isParentElementRTL(selection));

			// Update links
			const node = getSelectedNode(selection);
			const parent = node.getParent();
			if ($isLinkNode(parent) || $isLinkNode(node)) {
				setIsLink(true);
			} else {
				setIsLink(false);
			}

			if (elementDOM !== null) {
				setSelectedElementKey(elementKey);
				if ($isListNode(element)) {
					const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
					const type = parentList ? parentList.getListType() : element.getListType();
					setBlockType(type);
				} else {
					const type = $isHeadingNode(element) ? element.getTag() : element.getType();
					if (type in blockTypeToBlockName) {
						setBlockType(type as keyof typeof blockTypeToBlockName);
					}
					if ($isCodeNode(element)) {
						const language = element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
						setCodeLanguage(language ? CODE_LANGUAGE_MAP[language] || language : '');
						return;
					}
				}
			}
			// Handle buttons
			setFontSize($getSelectionStyleValueForProperty(selection, 'font-size', '15px'));
			setFontColor($getSelectionStyleValueForProperty(selection, 'color', '#000'));
			setBgColor($getSelectionStyleValueForProperty(selection, 'background-color', '#fff'));
			setFontFamily($getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'));
		}
	}, [activeEditor]);

	useEffect(() => {
		return editor.registerCommand(
			SELECTION_CHANGE_COMMAND,
			(_payload, newEditor) => {
				updateToolbar();
				setActiveEditor(newEditor);
				return false;
			},
			COMMAND_PRIORITY_CRITICAL
		);
	}, [editor, updateToolbar]);

	useEffect(() => {
		return mergeRegister(
			editor.registerEditableListener(editable => {
				setIsEditable(editable);
			}),
			activeEditor.registerUpdateListener(({ editorState }) => {
				editorState.read(() => {
					updateToolbar();
				});
			}),
			activeEditor.registerCommand<boolean>(
				CAN_UNDO_COMMAND,
				payload => {
					setCanUndo(payload);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			),
			activeEditor.registerCommand<boolean>(
				CAN_REDO_COMMAND,
				payload => {
					setCanRedo(payload);
					return false;
				},
				COMMAND_PRIORITY_CRITICAL
			)
		);
	}, [activeEditor, editor, updateToolbar]);

	const onCodeLanguageSelect = useCallback(
		(value: string) => {
			activeEditor.update(() => {
				if (selectedElementKey !== null) {
					const node = $getNodeByKey(selectedElementKey);
					if ($isCodeNode(node)) {
						node.setLanguage(value);
					}
				}
			});
		},
		[activeEditor, selectedElementKey]
	);

	const insertLink = useCallback(() => {
		if (!isLink) {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
		} else {
			editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
	}, [editor, isLink]);

	return (
		<div className='w-full flex mb-1 p-1 align-middle gap-2'>
			<Button
				isIconOnly
				isDisabled={!canUndo || !isEditable}
				onClick={() => {
					activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
				}}
				title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
				type='button'
				className='toolbar-item spaced'
				aria-label='Undo'
			>
				<Undo />
			</Button>
			<Button
				isIconOnly
				isDisabled={!canRedo || !isEditable}
				onClick={() => {
					activeEditor.dispatchCommand(REDO_COMMAND, undefined);
				}}
				title={IS_APPLE ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)'}
				type='button'
				className='toolbar-item'
				aria-label='Redo'
			>
				<Redo />
			</Button>
			<Divider orientation='vertical' />
			{blockType in blockTypeToBlockName && activeEditor === editor && (
				<>
					<BlockFormatDropDown isDisabled={!isEditable} blockType={blockType} editor={editor} />
					<Divider orientation='vertical' />
				</>
			)}
			{blockType === 'code' ? (
				<>
					<Dropdown isDisabled={!isEditable}>
						{CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
							return (
								<DropdownItem
									className={`item ${dropDownActiveClass(value === codeLanguage)}`}
									onClick={() => onCodeLanguageSelect(value)}
									key={value}
								>
									<span className='text'>{name}</span>
								</DropdownItem>
							);
						})}
					</Dropdown>
				</>
			) : (
				<>
					<FontDropDown isDisabled={!isEditable} style={'font-family'} value={fontFamily} editor={editor} />
					<FontDropDown isDisabled={!isEditable} style={'font-size'} value={fontSize} editor={editor} />
					<Button
						isIconOnly
						isDisabled={!isEditable}
						onClick={() => {
							activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
						}}
						className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
						title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
						type='button'
						aria-label={`Format text as bold. Shortcut: ${IS_APPLE ? '⌘B' : 'Ctrl+B'}`}
					>
						<Bold />
					</Button>
					<Button
						isIconOnly
						isDisabled={!isEditable}
						onClick={() => {
							activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
						}}
						className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
						title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
						type='button'
						aria-label={`Format text as italics. Shortcut: ${IS_APPLE ? '⌘I' : 'Ctrl+I'}`}
					>
						<Italic />
					</Button>
					<Button
						isIconOnly
						isDisabled={!isEditable}
						onClick={() => {
							activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
						}}
						className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
						title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
						type='button'
						aria-label={`Format text to underlined. Shortcut: ${IS_APPLE ? '⌘U' : 'Ctrl+U'}`}
					>
						<Underline />
					</Button>
					<Button
						isIconOnly
						isDisabled={!isEditable}
						onClick={() => {
							activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
						}}
						className={'toolbar-item spaced ' + (isCode ? 'active' : '')}
						title='Insert code block'
						type='button'
						aria-label='Insert code block'
					>
						<Code />
					</Button>
					<Button
						isIconOnly
						isDisabled={!isEditable}
						onClick={insertLink}
						className={'toolbar-item spaced ' + (isLink ? 'active' : '')}
						aria-label='Insert link'
						title='Insert link'
						type='button'
					>
						<Link />
					</Button>
					<Divider orientation='vertical' />
					<Dropdown isDisabled={!isEditable}>
						<DropdownItem
							key={'left'}
							onClick={() => {
								activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
							}}
							className='item'
						>
							<AlignLeft />
							<span className='text'>Left Align</span>
						</DropdownItem>
						<DropdownItem
							key={'center'}
							onClick={() => {
								activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
							}}
							className='item'
						>
							<AlignCenter />
							<span className='text'>Center Align</span>
						</DropdownItem>
						<DropdownItem
							key={'right'}
							onClick={() => {
								activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
							}}
							className='item'
						>
							<AlignRight />
							<span className='text'>Right Align</span>
						</DropdownItem>
						<DropdownItem
							key={'justify'}
							onClick={() => {
								activeEditor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
							}}
							className='item'
						>
							<AlignJustify />
							<span className='text'>Justify Align</span>
						</DropdownItem>
						<Divider orientation='vertical' />
					</Dropdown>
				</>
			)}
		</div>
	);
}
