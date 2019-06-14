import { Document } from './Document'
import { Block } from './Block'
import { BlockAttributesMap } from '@delta/attributes'
import { boundMethod } from 'autobind-decorator'
import { Selection } from '@delta/Selection'
import { TextTransformsRegistry } from '@core/TextTransformsRegistry'
import { DeltaChangeContext } from '@delta/DeltaChangeContext'
import mergeLeft from 'ramda/es/mergeLeft'

export class TextBlock extends Block {
  private cursorTextAttributes: BlockAttributesMap = {}
  private length: number = 0

  public constructor(blockInterface: Document.BlockInterface) {
    super(blockInterface)
  }

  private updateLineType(selection: Selection): void {
    const lineType = this.getDelta().getLineTypeInSelection(selection)
    this.blockInterface.bridgeInnerInterface.setSelectedLineType(lineType)
  }

  private updateTextAttributes(selection: Selection): void {
    const textAttributes = this.getDelta().getSelectedTextAttributes(selection)
    this.blockInterface.bridgeInnerInterface.setSelectedTextAttributes(textAttributes)
  }

  public handleOnSelectionChange(selection: Selection): void {
    this.selection = selection
    this.updateTextAttributes(selection)
    this.updateLineType(selection)
  }

  public getLength(): number {
    return this.length
  }

  public setCursorAttributes(cursorTextAttributes: BlockAttributesMap): BlockAttributesMap {
    this.cursorTextAttributes = mergeLeft(cursorTextAttributes, this.cursorTextAttributes)
    return this.cursorTextAttributes
  }

  public getCursorAttributes(): BlockAttributesMap {
    return this.cursorTextAttributes
  }

  public getTextTransformsRegistry(): TextTransformsRegistry {
    return this.blockInterface.bridgeInnerInterface.getTextTransformsReg()
  }

  @boundMethod
  public handleOnTextChange(newText: string, deltaChangeContext: DeltaChangeContext): void {
    const documentDeltaUpdate = this.getDelta().applyTextDiff(newText, deltaChangeContext, this.cursorTextAttributes)
    this.updateDelta(documentDeltaUpdate)
    this.length = newText.length
    this.updateTextAttributes(deltaChangeContext.selectionAfterChange)
    const lineType = documentDeltaUpdate.getLineTypeInSelection(deltaChangeContext.selectionAfterChange)
    this.blockInterface.bridgeInnerInterface.setSelectedLineType(lineType)
  }
}
