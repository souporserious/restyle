import { Component, type ComponentProps, type FC, type Ref } from 'react'
import { expectTypeOf, test } from 'vitest'
import { styled } from './styled.js'
import type { StyledComponent } from './types.js'

test('basic component type is preserved', () => {
  const component = ({
    className,
    name,
  }: {
    className: string
    name: string
  }) => <div className={className}>{name}</div>
  const extended = styled(component, {})

  expectTypeOf(extended).toMatchTypeOf<typeof component>()
})

test('additional property types are added', () => {
  const component = ({
    className,
    name,
  }: {
    className: string
    name: string
  }) => <div className={className}>{name}</div>
  const extended = styled(component, ({ color }: { color: string }) => ({
    color,
  }))

  expectTypeOf(extended).toMatchTypeOf<
    FC<{
      className: string
      name: string
      color: string
    }>
  >()

  const extended2 = styled('div', (props: { color: string }) => ({
    color: props.color,
  }))

  expectTypeOf(extended2).toMatchTypeOf<FC<{ color: string }>>()
})

test('style props are filtered from the component props', () => {
  const component = ({
    className,
    color,
  }: {
    className: string
    color?: number
  }) => <div className={className}>{color}</div>
  const extended = styled(component, ({ color }: { color: string }) => ({
    color,
  }))

  expectTypeOf(extended).toMatchTypeOf<
    StyledComponent<{
      className: string
      color: number & string
    }>
  >()

  const extended2 = styled(
    'button',
    (styleProps: { color: string }, props) => ({
      color: styleProps.color,
      opacity: props.disabled ? 0.5 : 1,
    })
  )

  expectTypeOf(extended2).toMatchTypeOf<
    FC<{
      color: string
      disabled?: boolean
    }>
  >()
})

test('style props are allowed to override the component type', () => {
  const component = ({
    className,
    color,
  }: {
    className: string
    color: number
  }) => <div className={className}>{color}</div>

  const Component = styled(component, ({ color }: { color: string }) => ({
    color,
  }))

  const App = () => <Component className="abc" color="red" />

  const Button = styled(
    'button',
    (styleProps: { disabled: boolean }, props) => {
      styleProps.disabled
      // @ts-expect-error disabled is treated as a style prop so it's won't be forwarded to the component
      props.disabled
      return {}
    }
  )
})

test('extra properties are not allowed', () => {
  const Component = ({ className }: { className: string }) => (
    <div className={className} />
  )
  const Extended = styled(Component, { color: 'red' })
  const ExtendedWithProps = styled(
    Extended,
    ({ color }: { color: string }) => ({ color })
  )

  const basicTest = (
    <Extended
      className="abc"
      // @ts-expect-error name does not exist on type
      name="abc"
    />
  )
  const propsTest = (
    <ExtendedWithProps
      className="abc"
      // @ts-expect-error name does not exist on type
      name="abc"
      color="red"
    />
  )

  const Extended2 = styled('div', { color: 'red' })
  const ExtendedWithProps2 = styled(
    Extended2,
    ({ color }: { color: string }) => ({
      color,
    })
  )

  const basicTest2 = (
    <Extended2
      className="abc"
      // @ts-expect-error name does not exist on type
      name="abc"
    />
  )
  const propsTest2 = (
    <ExtendedWithProps2
      className="abc"
      // @ts-expect-error name does not exist on type
      name="abc"
      color="red"
    />
  )
})

test('props used in style props resolver are forwarded', () => {
  const StyledDiv = styled('div', (styleProps: { color: string }, props) => ({
    color: styleProps.color,
    opacity: props['aria-disabled'] ? 0.6 : 1,
  }))

  const test = <StyledDiv color="tomato" aria-disabled />
})

test('extra properties are permitted if style props allow them', () => {
  const Component = ({ className }: { className: string }) => (
    <div className={className} />
  )
  const Extended = styled(Component, { color: 'red' })
  const ExtendedWithProps = styled(
    Extended,
    ({ color }: { [key: string]: string }) => ({
      color,
    })
  )

  const basicTest = (
    <Extended
      className="abc"
      // @ts-expect-error name does not exist on type
      name="abc"
    />
  )
  const propsTest = <ExtendedWithProps className="abc" name="abc" color="red" />

  const Extended2 = styled('div', { color: 'red' })
  const ExtendedWithProps2 = styled(
    Extended2,
    ({ color }: { [key: string]: string }) => ({
      color,
    })
  )

  const basicTest2 = (
    <Extended2
      className="abc"
      // @ts-expect-error name does not exist on type
      name="abc"
    />
  )
  const propsTest2 = (
    <ExtendedWithProps2 className="abc" name="abc" color="red" />
  )
})

test('style props are required to be a record', () => {
  const component = ({ className }: { className: string }) => (
    <div className={className} />
  )

  // allowed
  styled(component, (props: unknown) => ({ color: 'red' }))
  styled(component, (props: never) => ({ color: 'red' }))
  styled(component, (props: object) => ({ color: 'red' }))

  // disallowed
  // @ts-expect-error
  styled(component, (props: number) => ({ color: 'red' }))
  // @ts-expect-error
  styled(component, (props: string) => ({ color: 'red' }))
  // @ts-expect-error
  styled(component, (props: undefined) => ({ color: 'red' }))
  // @ts-expect-error
  styled(component, (props: null) => ({ color: 'red' }))
  // @ts-expect-error
  styled(component, (props: { color: string } | undefined) => ({
    color: 'red',
  }))

  // allowed
  styled('div', (props: unknown) => ({ color: 'red' }))
  styled('div', (props: never) => ({ color: 'red' }))
  styled('div', (props: object) => ({ color: 'red' }))

  // disallowed
  // @ts-expect-error
  styled('div', (props: number) => ({ color: 'red' }))
  // @ts-expect-error
  styled('div', (props: string) => ({ color: 'red' }))
  // @ts-expect-error
  styled('div', (props: undefined) => ({ color: 'red' }))
  // @ts-expect-error
  styled('div', (props: null) => ({ color: 'red' }))
  // @ts-expect-error
  styled('div', (props: { color: string } | undefined) => ({
    color: 'red',
  }))
})

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      disallowed: { color: string }
    }
  }
}

test('component is required to have a className prop', () => {
  const withClassName = (props: { className?: string }) => <div />
  const withoutClassName = (props: { color: string }) => <div />

  // allowed
  styled(withClassName)
  styled('div')

  const test = (
    <>
      <disallowed color="red" />
    </>
  )

  // not allowed
  // @ts-expect-error
  styled(withoutClassName)
  // @ts-expect-error
  styled('disallowed')
})

test('generic types are preserved without style props', () => {
  const Component = <SomeText extends string>({
    id,
    one,
    two,
    className,
  }: {
    id: `id-${SomeText}`
    one: NoInfer<SomeText>
    two: NoInfer<SomeText>
    className?: string
  }) => <></>
  const Extended = styled(Component)

  const test = (
    <>
      <Component<'abc'> id="id-abc" one="abc" two="abc" />
      <Extended<'abc'> id="id-abc" one="abc" two="abc" />
    </>
  )
  Component({
    id: 'id-abc',
    one: 'abc',
    // @ts-expect-error types require 'abc'
    two: 'xyz',
  })
  Extended({
    id: 'id-abc',
    one: 'abc',
    // @ts-expect-error types require 'abc'
    two: 'xyz',
  })
})

test('generic types are preserved with style props', () => {
  const Component = <SomeText extends string>({
    id,
    one,
    two,
    className,
  }: {
    id: `id-${SomeText}`
    one: NoInfer<SomeText>
    two: NoInfer<SomeText>
    className?: string
  }) => <></>
  const Extended = styled(Component, ({ color }: { color: string }) => ({
    color,
  }))

  const test = (
    <>
      <Component<'abc'> id="id-abc" one="abc" two="abc" />
      <Extended<'abc'> id="id-abc" one="abc" two="abc" color="red" />
    </>
  )
  Component({
    id: 'id-abc',
    one: 'abc',
    // @ts-expect-error types require 'abc'
    two: 'xyz',
  })
  Extended({
    color: 'red',
    id: 'id-abc',
    one: 'abc',
    // @ts-expect-error types require 'abc'
    two: 'xyz',
  })
})

test('generic types are preserved even when partially overwritten by style props', () => {
  const component = <SomeText extends string>({
    id,
    one,
    two,
    className,
  }: {
    id: `id-${SomeText}`
    one?: NoInfer<SomeText>
    two: NoInfer<SomeText>
    className?: string
  }) => <></>
  const extended = styled(component, ({ one }: { one: string }) => ({
    color: one,
  }))

  component({
    id: 'id-abc',
    one: 'abc',
    // @ts-expect-error types require 'abc'
    two: 'xyz',
  })
  extended({
    id: 'id-abc',
    one: 'xyz',
    // @ts-expect-error types require 'abc'
    two: 'xyz',
  })
})

test('generic types with multiple generics are preserved', () => {
  const Component = <SomeText extends string, AnotherText extends string>({
    id,
    one,
    two,
    className,
  }: {
    id: `id-${SomeText}-${AnotherText}`
    one: NoInfer<SomeText>
    two: NoInfer<AnotherText>
    className?: string
  }) => <></>
  const Extended = styled(Component, ({ color }: { color: string }) => ({
    color,
  }))

  const test = (
    <>
      <Component<'abc', 'xyz'> id="id-abc-xyz" one="abc" two="xyz" />
      <Extended<'abc', 'xyz'> id="id-abc-xyz" one="abc" two="xyz" color="red" />
    </>
  )
  Component({
    id: 'id-abc-xyz',
    one: 'abc',
    // @ts-expect-error types require 'abc'
    two: 'abc',
  })
  Extended({
    color: 'red',
    id: 'id-abc-xyz',
    one: 'abc',
    // @ts-expect-error types require 'abc'
    two: 'abc',
  })
})

test('class components work', () => {
  class WithClass extends Component<{ className?: string }> {
    override render() {
      return <div className={this.props.className} />
    }
  }
  const Extended = styled(WithClass, { color: 'red' })

  const test = (
    <>
      <Component className="abc" />
      <Extended className="abc" />
    </>
  )
})

test('css prop is added to the component props', () => {
  const Test = (props: { className?: string }) => (
    <div className={props.className} />
  )
  const Extended = styled(Test, { color: 'red' })

  const test = (
    <>
      <Test
        className="abc"
        // @ts-expect-error css prop does not exist yet
        css={{ color: 'red' }}
      />
      <Extended className="abc" css={{ color: 'red' }} />
    </>
  )
})

test('components that return non-element react nodes are allowed', () => {
  const NullComponent = ({ className }: { className: string }) => null
  const NullExtended = styled(NullComponent, { color: 'red' })
  const StringComponent = ({ className }: { className: string }) => 'abc'
  const StringExtended = styled(StringComponent, { color: 'red' })
  const NumberComponent = ({ className }: { className: string }) => 123
  const NumberExtended = styled(NumberComponent, { color: 'red' })
})

test('async components are allowed', () => {
  const Component: (props: {
    className?: string
  }) => Promise<React.ReactNode> = () => Promise.resolve(null)
  const Extended = styled(Component, { color: 'red' })
})

test('unions are not broken', () => {
  type ButtonProps = {
    type: 'submit' | 'button' | 'reset'
    onClick?: VoidFunction
    className?: string
  }

  type AnchorProps = {
    href: string | null | undefined
    className?: string
  }

  type LinkProps = ButtonProps | AnchorProps

  const Test: FC<LinkProps> = () => null
  const Extended = styled(Test, ({ active }: { active: boolean }) => ({
    color: 'red',
  }))

  const test = (
    <>
      <Test href="test" />
      <Test type="button" onClick={() => {}} />
      <Extended href="test" active />
      <Extended type="button" onClick={() => {}} active />
    </>
  )
})
