# Database Seeding: Approach Comparison

This document compares the two seeding approaches used in this project and provides guidelines for when to use each.

---

## 📊 Quick Comparison

| Feature           | Manual Approach                      | drizzle-seed                         |
| ----------------- | ------------------------------------ | ------------------------------------ |
| **Syntax**        | `db.insert().values()` with loops    | `seed()` with `.refine()`            |
| **Boilerplate**   | High (chunking, error handling)      | Low (declarative)                    |
| **Data Source**   | External JSON files or manual arrays | Built-in generators + custom arrays  |
| **Relations**     | Manual foreign key resolution        | Automatic relation handling          |
| **Randomization** | None (fixed data)                    | Seeded randomization (deterministic) |
| **Best For**      | Real production data                 | Test/mock data                       |

---

## 📝 Approach 1: Manual Seeding (Countries & Cities)

### Example: `src/db/seeds/countries.ts`

```typescript
import type { Database } from '@/db';

import { countries as countriesTable } from '../models';
import countries from './data/countries.json';

const CHUNK_SIZE = 50;

export default async function seed(db: Database) {
  for (let i = 0; i < countries.length; i += CHUNK_SIZE) {
    const chunk = countries.slice(i, i + CHUNK_SIZE);
    await db.insert(countriesTable).values(chunk);
  }
}
```

### Example: `src/db/seeds/cities.ts`

```typescript
import type { Database } from '@/db';

import { cities as citiesTable, countries as countriesTable } from '../models';
import cities from './data/cities.json';

const CHUNK_SIZE = 50;

export default async function seed(db: Database) {
  // Manual foreign key resolution
  const countries = await db.select().from(countriesTable);

  const citiesWithCountryId = cities.map((city) => {
    const countryId = countries.find((c) => c.isoCode === city.countryCode)?.id;
    if (!countryId) {
      throw new Error(`Country not found for city: ${city.name}`);
    }
    return {
      name: city.name,
      countryId,
      countryCode: city.countryCode,
      stateCode: city.stateCode,
      latitude: city.latitude,
      longitude: city.longitude,
    };
  });

  for (let i = 0; i < citiesWithCountryId.length; i += CHUNK_SIZE) {
    const chunk = citiesWithCountryId.slice(i, i + CHUNK_SIZE);
    await db.insert(citiesTable).values(chunk);
  }
}
```

### ✅ Pros

- **Full control** over every field value
- **Deterministic** - same data every time
- **Import real data** from JSON, CSV, APIs
- **Better for migrations** from existing systems
- **Easy to debug** - explicit data transformations

### ❌ Cons

- **More boilerplate** - chunking, loops, error handling
- **Requires external files** for large datasets
- **Manual relation handling** - foreign key resolution
- **No variety** - same data every run
- **Harder to scale** for large mock datasets

---

## 🎲 Approach 2: drizzle-seed (Colors)

### Example: `src/modules/colors/colors.seed.ts`

```typescript
import { seed } from 'drizzle-seed';
import type { Database } from '@/db';
import { Colors, COLORS_DESCRIPTIONS } from './colors.constants';
import { colors as colorsTable } from './colors.model';

const ADDITIONAL_COLORS_COUNT = 20;

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
        // Mix predefined constants with generated colors
        name: f.weightedRandom([
          {
            weight: 0.5,
            value: f.valuesFromArray({ values: predefinedColorNames }),
          },
          {
            weight: 0.5,
            value: f.valuesFromArray({
              values: ['coral', 'teal', 'navy', 'maroon' /* ... */],
            }),
          },
        ]),
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
    `✓ Seeded ${predefinedColorNames.length} predefined + ${ADDITIONAL_COLORS_COUNT} generated colors`,
  );
}
```

### ✅ Pros

- **Less boilerplate** - single function call
- **Built-in generators** - names, dates, numbers, etc.
- **Weighted randomization** - mix fixed and generated data
- **Automatic relations** - foreign keys handled by drizzle-seed
- **Deterministic** - same seed = same data across runs
- **Scalable** - easily generate 1000s of records
- **Type-safe** - full TypeScript support

### ❌ Cons

- **Not for real data** - generators create mock data
- **Limited generators** - no `colorName()`, `text()`, etc. yet
- **Learning curve** - new API to understand
- **Less control** - can't specify exact field values easily
- **Dependency** - adds `drizzle-seed` package

---

## 🎯 When to Use What

### ✅ Use Manual Seeding When:

| Scenario                           | Example                                |
| ---------------------------------- | -------------------------------------- |
| **Importing real production data** | Countries, cities from government APIs |
| **Fixed datasets**                 | Roles, permissions, enum values        |
| **External data sources**          | JSON exports, CSV imports              |
| **Exact control needed**           | Specific test fixtures                 |
| **Migration from legacy systems**  | Moving from old database               |

**Current examples in your project:**

- `src/db/seeds/countries.ts` - Real country data from JSON
- `src/db/seeds/cities.ts` - Real city data with foreign key resolution

---

### ✅ Use drizzle-seed When:

| Scenario                           | Example                                    |
| ---------------------------------- | ------------------------------------------ |
| **Test/mock data for development** | Users, products, orders                    |
| **Need variety in data**           | Different names, emails, dates             |
| **Large datasets for testing**     | 1000s of records for performance tests     |
| **Rapid prototyping**              | Quick setup without maintaining JSON files |
| **Relational data generation**     | Users with posts, orders with items        |

**Current examples in your project:**

- `src/modules/colors/colors.seed.ts` - Mix of predefined + generated colors

---

## 📁 Project Structure

```
packages/api/src/
├── db/
│   ├── seeds/
│   │   ├── index.ts                    # Exports all seeds
│   │   ├── countries.ts                # Manual approach
│   │   ├── cities.ts                   # Manual approach
│   │   └── data/
│   │       ├── countries.json          # Real data
│   │       └── cities.json             # Real data
│   └── seed.ts                         # Main orchestrator
│
└── modules/
    └── colors/
        └── colors.seed.ts              # drizzle-seed approach
```

**As the project grows**, each module can have its own `.seed.ts` file using drizzle-seed:

```
modules/
├── users/
│   └── users.seed.ts          # drizzle-seed for mock users
├── products/
│   └── products.seed.ts       # drizzle-seed for mock products
├── orders/
│   └── orders.seed.ts         # drizzle-seed for mock orders
└── colors/
    └── colors.seed.ts         # drizzle-seed (already done!)
```

---

## 🚀 Usage

### Run All Seeds

```bash
pnpm db:seed
```

This will:

1. Truncate all tables (in dependency order)
2. Seed colors using drizzle-seed (10 predefined + 20 generated)
3. Seed countries from JSON
4. Seed cities from JSON with foreign key resolution

### Seed Only Colors (for testing)

You can run colors seed independently by modifying `seed.ts` or creating a standalone script.

---

## 🔧 Available drizzle-seed Generators

| Generator                                | Description      | Example                 |
| ---------------------------------------- | ---------------- | ----------------------- |
| `f.fullName()`                           | Full names       | `"John Doe"`            |
| `f.firstName()` / `f.lastName()`         | First/last names | `"John"` / `"Doe"`      |
| `f.companyName()`                        | Company names    | `"Acme Corp"`           |
| `f.jobTitle()`                           | Job titles       | `"Software Engineer"`   |
| `f.streetAddress()`                      | Street addresses | `"123 Main St"`         |
| `f.city()` / `f.state()` / `f.country()` | Locations        | `"New York"`            |
| `f.postcode()`                           | Postal codes     | `"10001"`               |
| `f.phoneNumber({ template })`            | Phone numbers    | `"(555) 123-4567"`      |
| `f.loremIpsum()`                         | Placeholder text | `"Lorem ipsum..."`      |
| `f.int({ min, max, isUnique })`          | Integers         | `42`                    |
| `f.number({ min, max, precision })`      | Decimals         | `3.14`                  |
| `f.date({ minDate, maxDate })`           | Dates            | `2024-01-15`            |
| `f.valuesFromArray({ values })`          | Custom array     | Pick from your values   |
| `f.weightedRandom([{ weight, value }])`  | Weighted mix     | Mix multiple generators |
| `f.default({ defaultValue })`            | Static fallback  | `"pending"`             |

---

## 💡 Best Practices

1. **Use manual seeding for reference data** (enums, countries, roles)
2. **Use drizzle-seed for test data** (users, products, transactions)
3. **Always set a seed value** for deterministic results: `seed: 123`
4. **Mix approaches** when needed (like colors: constants + generated)
5. **Keep module seeds close to the module** (not in `/db/seeds/`)
6. **Document your seeding strategy** in each module

---

## 🐛 Common Issues Fixed

### Bug: `createdBy` / `updatedBy` fields not found

**Fixed**: Removed non-existent fields from colors seed. The colors table schema doesn't include audit fields.

### Bug: Colors table not truncated during seeding

**Fixed**: Added `schema.colors` to `allTables` array in `src/db/tables.ts`.

### Bug: Colors seed not called in main seed runner

**Fixed**: Integrated `seeds.colors(db)` in `src/db/seed.ts`.

---

## 📚 Resources

- [drizzle-seed Documentation](https://orm.drizzle.team/docs/seed-overview)
- [Drizzle ORM Seeding Guide](https://orm.drizzle.team/docs/seed-overview)
- [faker.js Documentation](https://fakerjs.dev/)
