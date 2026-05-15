import { seed } from 'drizzle-seed';

import type { Database } from '@/db';

import { Colors, COLORS_DESCRIPTIONS } from './colors.constants';

import { colors as colorsTable } from './colors.model';

// Number of additional faker-generated colors beyond the predefined ones

const aditionalColors = ['rust'];
const ADDITIONAL_COLORS_COUNT = aditionalColors.length;

export default async function seedColors(db: Database) {
  const predefinedColorNames = Object.values(Colors);
  const predefinedColorDescriptions = Object.values(COLORS_DESCRIPTIONS);

  await seed(
    db,
    { colors: colorsTable },
    {
      count: predefinedColorNames.length + ADDITIONAL_COLORS_COUNT,
      seed: 123, // Deterministic seed for reproducibility
    },
  ).refine((f) => ({
    colors: {
      columns: {
        // Use all color names (predefined + additional) in a single array
        name: f.valuesFromArray({
          values: [...predefinedColorNames, ...aditionalColors],
          isUnique: true,
        }),
        description: f.weightedRandom([
          {
            weight: 0.5,
            value: f.valuesFromArray({ values: predefinedColorDescriptions }),
          },
          {
            weight: 0.5,
            value: f.loremIpsum(),
          },
        ]),
      },
    },
  }));

  console.log(
    `Seeded ${predefinedColorNames.length} predefined colors + ${ADDITIONAL_COLORS_COUNT} generated colors`,
  );
}
