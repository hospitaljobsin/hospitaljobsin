/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Button, Divider } from '@heroui/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, type HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import {
	$createParagraphNode,
	$getSelection,
	$isRangeSelection,
	CAN_REDO_COMMAND,
	CAN_UNDO_COMMAND,
	COMMAND_PRIORITY_LOW,
	FORMAT_ELEMENT_COMMAND,
	FORMAT_TEXT_COMMAND,
	REDO_COMMAND,
	SELECTION_CHANGE_COMMAND,
	UNDO_COMMAND
} from 'lexical';
import {
	BoldIcon,
	ItalicIcon,
	RedoIcon,
	TextAlignCenterIcon,
	TextAlignEndIcon,
	TextAlignJustifyIcon,
	TextAlignStartIcon,
	UnderlineIcon,
	UndoIcon
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

function HeadingToolbarPlugin() {
	const [editor] = useLexicalComposerContext();
	const headingTags: HeadingTagType[] = ['h1', 'h2', 'h3'];

	return (
		<>
			{headingTags.map(tag => (
				<Button
					key={tag}
					isIconOnly
					size='sm'
					variant='flat'
					onPress={() => {
						editor.update(() => {
							const selection = $getSelection();
							if ($isRangeSelection(selection)) {
								// Check if the selection is already in an H1 node
								const anchorNode = selection.anchor.getNode();
								const topLevelElement = anchorNode.getTopLevelElementOrThrow();
								// Use type guard for HeadingNode
								if (
									topLevelElement.getType() === 'heading' &&
									'getTag' in topLevelElement &&
									typeof (topLevelElement as { getTag: () => string }).getTag === 'function' &&
									(topLevelElement as { getTag: () => string }).getTag() === tag
								) {
									// If already H1, convert to paragraph
									$setBlocksType(selection, () => $createParagraphNode());
								} else {
									// Otherwise, set to H1
									$setBlocksType(selection, () => $createHeadingNode(tag));
								}
							}
						});
					}}
					aria-label={`Format ${tag.toUpperCase()}`}
				>
					{tag.toUpperCase()}
				</Button>
			))}
		</>
	);
}

export default function ToolbarPlugin() {
	const [editor] = useLexicalComposerContext();
	const toolbarRef = useRef(null);
	const [canUndo, setCanUndo] = useState(false);
	const [canRedo, setCanRedo] = useState(false);
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isUnderline, setIsUnderline] = useState(false);

	const $updateToolbar = useCallback(() => {
		const selection = $getSelection();
		if ($isRangeSelection(selection)) {
			// Update text format
			setIsBold(selection.hasFormat('bold'));
			setIsItalic(selection.hasFormat('italic'));
			setIsUnderline(selection.hasFormat('underline'));
		}
	}, []);

	useEffect(() => {
		return mergeRegister(
			editor.registerUpdateListener(({ editorState }) => {
				editorState.read(
					() => {
						$updateToolbar();
					},
					{ editor }
				);
			}),
			editor.registerCommand(
				SELECTION_CHANGE_COMMAND,
				(_payload, _newEditor) => {
					$updateToolbar();
					return false;
				},
				COMMAND_PRIORITY_LOW
			),
			editor.registerCommand(
				CAN_UNDO_COMMAND,
				payload => {
					setCanUndo(payload);
					return false;
				},
				COMMAND_PRIORITY_LOW
			),
			editor.registerCommand(
				CAN_REDO_COMMAND,
				payload => {
					setCanRedo(payload);
					return false;
				},
				COMMAND_PRIORITY_LOW
			)
		);
	}, [editor, $updateToolbar]);

	return (
		<div className='flex gap-2 w-full items-center overflow-x-auto' ref={toolbarRef}>
			<Button
				isIconOnly
				size='sm'
				variant='flat'
				isDisabled={!canUndo}
				onPress={() => {
					editor.dispatchCommand(UNDO_COMMAND, undefined);
				}}
				aria-label='Undo'
			>
				<UndoIcon size={16} />
			</Button>
			<Button
				isIconOnly
				size='sm'
				variant='flat'
				isDisabled={!canRedo}
				onPress={() => {
					editor.dispatchCommand(REDO_COMMAND, undefined);
				}}
				aria-label='Redo'
			>
				<RedoIcon size={16} />
			</Button>
			<Divider orientation='vertical' className='py-4 mx-2 h-full' />
			<HeadingToolbarPlugin />
			<Divider orientation='vertical' className='py-4 mx-2 h-full' />
			<Button
				isIconOnly
				size='sm'
				variant='flat'
				onPress={() => {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
				}}
				className={'toolbar-item spaced ' + (isBold ? 'active' : '')}
				aria-label='Format Bold'
			>
				<BoldIcon size={16} />
			</Button>
			<Button
				isIconOnly
				size='sm'
				variant='flat'
				onPress={() => {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
				}}
				className={'toolbar-item spaced ' + (isItalic ? 'active' : '')}
				aria-label='Format Italics'
			>
				<ItalicIcon size={16} />
			</Button>
			<Button
				isIconOnly
				size='sm'
				variant='flat'
				onPress={() => {
					editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
				}}
				className={'toolbar-item spaced ' + (isUnderline ? 'active' : '')}
				aria-label='Format Underline'
			>
				<UnderlineIcon size={16} />
			</Button>
			<Divider orientation='vertical' className='py-4 mx-2 h-full' />
			<Button
				isIconOnly
				size='sm'
				variant='flat'
				onPress={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
				}}
				aria-label='Left Align'
			>
				<TextAlignStartIcon size={16} />
			</Button>
			<Button
				isIconOnly
				size='sm'
				variant='flat'
				onPress={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
				}}
				aria-label='Center Align'
			>
				<TextAlignCenterIcon size={16} />
			</Button>
			<Button
				isIconOnly
				size='sm'
				variant='flat'
				onPress={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
				}}
				aria-label='Right Align'
			>
				<TextAlignEndIcon size={16} />
			</Button>
			<Button
				isIconOnly
				size='sm'
				variant='flat'
				onPress={() => {
					editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
				}}
				aria-label='Justify Align'
			>
				<TextAlignJustifyIcon size={16} />
			</Button>
		</div>
	);
}
