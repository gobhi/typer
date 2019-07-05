/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { PureComponent } from 'react'
import { TextBlockInput, TextBlockInputProps } from './TextBlockInput'
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native'
import { ImageBlockInput, ImageBlockInputProps } from './ImageBlockInput'
import { TextOp, ImageOp } from '@delta/operations'
import invariant from 'invariant'
import { Transforms } from '@core/Transforms'
import { Attributes } from '@delta/attributes'
import { SelectionShape } from '@delta/Selection'
import { StandardBlockInputProps } from './types'
import { Images } from '@core/Images'

export interface GenericBlockInputProps<ImageSource> extends StandardBlockInputProps {
  textTransformSpecs: Transforms.Specs
  textAttributesAtCursor: Attributes.Map
  contentWidth: null | number
  blockScopedSelection: SelectionShape | null
  hightlightOnFocus: boolean
  ImageComponent: Images.Component<ImageSource>
  textStyle?: StyleProp<TextStyle>
  blockStyle?: StyleProp<ViewStyle>
  maxMediaBlockWidth?: number
  maxMediaBlockHeight?: number
  underlayColor?: string
}

export class GenericBlockInput<ImageSource> extends PureComponent<GenericBlockInputProps<ImageSource>> {
  private getStyles() {
    if (this.props.hightlightOnFocus) {
      return this.props.isFocused
        ? { borderColor: 'red', borderWidth: 1 }
        : { borderColor: 'transparent', borderWidth: 1 }
    }
    return undefined
  }

  public render() {
    const {
      descriptor,
      textStyle,
      contentWidth,
      blockStyle,
      blockScopedSelection,
      controller,
      hightlightOnFocus,
      underlayColor,
      isFocused,
      maxMediaBlockHeight,
      maxMediaBlockWidth,
      overridingScopedSelection,
      textAttributesAtCursor,
      textTransformSpecs,
      ImageComponent,
    } = this.props
    let block = null
    const realContentWidth = contentWidth ? contentWidth - (hightlightOnFocus ? 2 : 0) : null
    if (descriptor.kind === 'text') {
      const textBlockProps: TextBlockInputProps = {
        descriptor,
        textStyle,
        controller,
        isFocused,
        blockScopedSelection,
        overridingScopedSelection: overridingScopedSelection,
        textAttributesAtCursor,
        textTransformSpecs,
        textOps: descriptor.opsSlice as TextOp[],
      }
      block = <TextBlockInput {...textBlockProps} />
    } else if (descriptor.kind === 'image' && realContentWidth !== null) {
      invariant(descriptor.opsSlice.length === 1, `Image blocks must be grouped alone.`)
      const imageBlockProps: ImageBlockInputProps<ImageSource> = {
        descriptor,
        blockScopedSelection,
        controller,
        isFocused,
        maxMediaBlockHeight,
        maxMediaBlockWidth,
        overridingScopedSelection,
        underlayColor,
        ImageComponent,
        imageOp: descriptor.opsSlice[0] as ImageOp<ImageSource>,
        contentWidth: realContentWidth,
      }
      block = <ImageBlockInput<ImageSource> {...imageBlockProps} />
    }
    return <View style={[this.getStyles(), blockStyle]}>{block}</View>
  }
}