import { describe, it, expect } from 'vitest'

import { createRules, mergeStyles } from './create-rules.js'

describe('createRules', () => {
  it('should convert simple style object into CSS rules', () => {
    const result = createRules({ color: 'red' })
    expect(result).toMatchInlineSnapshot(`
      [
        "hh45au7",
        [
          [],
          [],
          [
            [
              "hh45au7",
              ".hh45au7{color:red}",
              {
                "color": "red",
              },
            ],
          ],
          [],
        ],
      ]
    `)
  })

  it('handles parent selectors', () => {
    const result = createRules({ '[data-theme]& span': { color: 'red' } })
    expect(result).toMatchInlineSnapshot(`
    [
      "h9ymzgp",
      [
        [],
        [],
        [],
        [
          [
            [],
            [],
            [
              [
                "h9ymzgp",
                "[data-theme].h9ymzgp span{color:red}",
                {
                  "color": "red",
                },
              ],
            ],
            [],
          ],
        ],
      ],
    ]
  `)
  })

  it('handles nested rules', () => {
    const result = createRules({
      'h1::before': {
        content: '""',
      },
      h1: {
        '&::before': {
          content: '""',
        },
      },
      '@media (width >= 768px)': {
        color: 'green',
        '@media (width <= 1024px)': {
          color: 'orange',
        },
      },
    })
    expect(result).toMatchInlineSnapshot(`
          [
            "ho9xm10 ho9xm10 h1vtbor2 h1qhiauq",
            [
              [],
              [],
              [],
              [
                [
                  [],
                  [],
                  [
                    [
                      "ho9xm10",
                      ".ho9xm10 h1::before{content:""}",
                      {
                        "content": """",
                      },
                    ],
                  ],
                  [],
                ],
                [
                  [],
                  [],
                  [],
                  [
                    [
                      [],
                      [],
                      [
                        [
                          "ho9xm10",
                          ".ho9xm10 h1::before{content:""}",
                          {
                            "content": """",
                          },
                        ],
                      ],
                      [],
                    ],
                  ],
                ],
                [
                  [],
                  [],
                  [
                    [
                      "h1vtbor2",
                      "@media (width >= 768px){.h1vtbor2{color:green}}",
                      {
                        "@media (width >= 768px)": {
                          "color": "green",
                        },
                      },
                    ],
                  ],
                  [
                    [
                      [],
                      [],
                      [
                        [
                          "h1qhiauq",
                          "@media (width >= 768px){@media (width <= 1024px){.h1qhiauq{color:orange}}}",
                          {
                            "@media (width >= 768px)": {
                              "@media (width <= 1024px)": {
                                "color": "orange",
                              },
                            },
                          },
                        ],
                      ],
                      [],
                    ],
                  ],
                ],
              ],
            ],
          ]
        `)
  })

  it('merges CSS objects', () => {
    const result = mergeStyles([
      {
        color: 'red',
        nested: { color: 'green', background: 'orange' },
        one: 2,
      },
      { color: 'blue', nested: { color: 'yellow' } },
    ])

    expect(result).toEqual({
      color: 'blue',
      nested: {
        color: 'yellow',
        background: 'orange',
      },
      one: 2,
    })
  })
})
