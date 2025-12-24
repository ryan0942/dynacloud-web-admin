'use client'

import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/react'

export default function HeroUITest() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        HeroUI Integration Test
      </h2>

      <div className="flex flex-wrap gap-4">
        <Button color="default">Default Button</Button>
        <Button color="primary">Primary Button</Button>
        <Button color="secondary">Secondary Button</Button>
        <Button color="success">Success Button</Button>
        <Button color="warning">Warning Button</Button>
        <Button color="danger">Danger Button</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-0">
            <h4 className="font-bold text-large">Card 1</h4>
          </CardHeader>
          <CardBody>
            <p className="text-small text-default-500">
              This is a test card using HeroUI components
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <h4 className="font-bold text-large">Card 2</h4>
          </CardHeader>
          <CardBody>
            <p className="text-small text-default-500">
              Testing with custom brand colors
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <h4 className="font-bold text-large">Card 3</h4>
          </CardHeader>
          <CardBody>
            <p className="text-small text-default-500">
              Tailwind v4 + HeroUI v2.8.5
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
