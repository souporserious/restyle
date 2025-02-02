import { expectTypeOf, test } from 'vitest'
import { styled } from './styled.js'
import type { FC } from 'react'

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
    FC<{
      className: string
      color: string
    }>
  >()
})

test('style props are not allowed to break the component type', () => {
  const component = ({
    className,
    color,
  }: {
    className: string
    color: number
  }) => <div className={className}>{color}</div>

  // @ts-expect-error extending with color would make color always undefined, which is a type error (color must be a number)
  const extended = styled(component, ({ color }: { color: string }) => ({
    color,
  }))
})

test('extra properties are not allowed', () => {
  const Component = ({ className }: { className: string }) => (
    <div className={className} />
  )
  const Extended = styled(Component, { color: 'red' })
  const ExtendedWithProps = styled(
    Extended,
    ({ color }: { color: string }) => ({
      color,
    })
  )

  // @ts-expect-error name does not exist on type
  const basicTest = <Extended className="abc" name="abc" />
  // @ts-expect-error name does not exist on type
  const propsTest = <ExtendedWithProps className="abc" name="abc" color="red" />
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

  // @ts-expect-error name does not exist on type
  const basicTest = <Extended className="abc" name="abc" />
  const propsTest = <ExtendedWithProps className="abc" name="abc" color="red" />
})

test('style props are required to be a record', () => {
  const component = ({ className }: { className: string }) => (
    <div className={className} />
  )

  // allowed
  styled(component, (props: unknown) => ({ color: 'red' }))
  styled(component, (props: never) => ({ color: 'red' }))

  // disallowed
  // @ts-expect-error
  styled(component, (props: number) => ({ color: 'red' }))
  // @ts-expect-error
  styled(component, (props: string) => ({ color: 'red' }))
  // @ts-expect-error
  styled(component, (props: Map<string, string>) => ({ color: 'red' }))
  // @ts-expect-error
  styled(component, (props: []) => ({ color: 'red' }))
  // @ts-expect-error
  styled(component, (props: Set<string>) => ({ color: 'red' }))
  // @ts-expect-error
  styled(component, (props: undefined) => ({ color: 'red' }))
  // @ts-expect-error
  styled(component, (props: null) => ({ color: 'red' }))
  // @ts-expect-error
  styled(component, (props: object) => ({ color: 'red' }))
  // @ts-expect-error
  styled(component, (props: { color: string } | undefined) => ({
    color: 'red',
  }))
})

/**
 * In a truly perfect world, styled would be able to preserve
 * any generic types of the component passed to it.
 *
 * i do not believe this is possible in typescript yet,
 * although there is probably some hacky workaround to be found
 */

// test('generic types are preserved without style props', () => {
//   const Component = <SomeText extends string>({
//     id,
//     one,
//     two,
//     className,
//   }: {
//     id: `id-${SomeText}`
//     one: NoInfer<SomeText>
//     two: NoInfer<SomeText>
//     className?: string
//   }) => <></>
//   const Extended = styled(Component)

//   const test = (
//     <>
//       <Component<'abc'> id="id-abc" one="abc" two="abc" />
//       <Extended<'abc'> id="id-abc" one="abc" two="abc" />
//     </>
//   )
//   Component({
//     id: 'id-abc',
//     one: 'abc',
//     // @ts-expect-error types require 'abc'
//     two: 'xyz',
//   })
//   Extended({
//     id: 'id-abc',
//     one: 'abc',
//     // @ts-expect-error types require 'abc'
//     two: 'xyz',
//   })
// })

// test('generic types are preserved with style props', () => {
//   const component = <SomeText extends string>({
//     id,
//     one,
//     two,
//     className,
//   }: {
//     id: `id-${SomeText}`
//     one: NoInfer<SomeText>
//     two: NoInfer<SomeText>
//     className?: string
//   }) => <></>
//   const extended = styled(component, ({ color }: { color: string }) => ({
//     color,
//   }))

//   component({
//     id: 'id-abc',
//     one: 'abc',
//     // @ts-expect-error types require 'abc'
//     two: 'xyz',
//   })
//   extended({
//     color: 'red',
//     id: 'id-abc',
//     one: 'abc',
//     // @ts-expect-error types require 'abc'
//     two: 'xyz',
//   })
// })

// test('generic types are preserved even when partially overwritten by style props', () => {
//   const component = <SomeText extends string>({
//     id,
//     one,
//     two,
//     className,
//   }: {
//     id: `id-${SomeText}`
//     one?: NoInfer<SomeText>
//     two: NoInfer<SomeText>
//     className?: string
//   }) => <></>
//   const extended = styled(component, ({ one }: { one: string }) => ({
//     color: one,
//   }))

//   component({
//     id: 'id-abc',
//     one: 'abc',
//     // @ts-expect-error types require 'abc'
//     two: 'xyz',
//   })
//   extended({
//     id: 'id-abc',
//     one: 'xyz', // <- allowable because the type comes from style props
//     // @ts-expect-error types require 'abc'
//     two: 'xyz',
//   })
// })
