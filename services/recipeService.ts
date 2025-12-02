import { Recipe, Difficulty } from '../types';

// THE MASTER LIST: Exactly 200 Authentic Mexican Dishes
const DISH_CATALOG = [
  // 1. Tacos (30)
  "Tacos Al Pastor", "Tacos de Carne Asada", "Tacos de Carnitas", "Tacos de Barbacoa", "Tacos de Canasta",
  "Tacos de Suadero", "Tacos de Lengua", "Tacos de Tripa", "Tacos de Cabeza", "Tacos de Pescado Baja Style",
  "Tacos de Camaron Capeado", "Tacos Gobernador", "Tacos Laguneros", "Tacos de Cecina", "Tacos de Birria",
  "Tacos de Cochinita Pibil", "Tacos Arabes", "Tacos de Chicharrón Prensado", "Tacos de Papa con Chorizo", "Tacos Dorados de Pollo",
  "Tacos de Bistec", "Tacos de Adobada", "Tacos de Chuleta", "Tacos de Sesos", "Tacos de Ojo",
  "Tacos de Labio", "Tacos de Buche", "Tacos de Nana", "Tacos de Machitos", "Tacos de Tuetano",

  // 2. Antojitos / Street Food (30)
  "Gringas de Pastor", "Volcanes de Asada", "Mulitas de Birria", "Quesabirria con Consome", "Vampiros de Adobada",
  "Sopes de Chorizo", "Sopes de Pollo", "Huaraches de Costilla", "Tlacoyos de Frijol", "Tlacoyos de Requeson",
  "Gorditas de Chicharrón", "Gorditas de Nata", "Gorditas de Migas", "Panuchos Yucatecos", "Salbutes de Pavo",
  "Tlayudas Oaxaqueñas", "Memelas con Asiento", "Molletes con Pico de Gallo", "Pambazos Rojo", "Tortas Ahogadas",
  "Torta Cubana", "Torta de Tamal", "Cemita Poblana", "Lonches de Pierna", "Guacamaya de Leon",
  "Elotes Callejeros", "Esquites con Tuetano", "Nachos Piedras Negras", "Chicharron Preparado", "Dorilocos de la Calle",

  // 3. Moles & Sauces (20)
  "Mole Poblano", "Mole Negro Oaxaqueño", "Mole Verde de Pepita", "Mole Amarillo", "Mole Coloradito",
  "Mole Manchamanteles", "Mole Chichilo", "Pipian Verde", "Pipian Rojo", "Adobo de Puerco",
  "Mole Rosa de Taxco", "Mole de Xico", "Mole Prieto", "Mole de Cadera", "Mole Ranchero",
  "Clemole", "Huaxmole", "Chichilo Negro", "Pato en Mole", "Enchiladas de Mole",

  // 4. Main Dishes (35)
  "Chiles en Nogada", "Chiles Rellenos de Queso", "Enchiladas Rojas", "Enchiladas Verdes", "Enchiladas Suizas",
  "Enchiladas Mineras", "Enchiladas Potosinas", "Enfrijoladas de Chorizo", "Entomatadas de Queso", "Enmoladas de Pollo",
  "Cochinita Pibil", "Poc Chuc", "Tikin Xic", "Pescado a la Talla", "Pescado Zarandeado",
  "Camarones a la Diabla", "Camarones al Mojo de Ajo", "Pulpo Enamorado", "Vuelve a la Vida", "Ceviche de Pescado",
  "Ceviche de Camaron", "Aguachile Verde", "Aguachile Rojo", "Langosta Puerto Nuevo", "Filete a la Tampiqueña",
  "Carne en su Jugo", "Punta de Filete Albañil", "Milanesa de Res Empanizada", "Bistec a la Mexicana", "Albondigas al Chipotle",
  "Tinga de Pollo", "Pollo con Mole", "Pollo Pibil", "Pollo Asado Sinaloa", "Mixiotes de Carnero",
  
  // 5. Stews & Regional (20)
  "Barbacoa de Hoyo", "Birria de Res Tatemada", "Cabrito al Pastor", "Machaca con Huevo", "Chilorio de Cerdo",
  "Asado de Boda", "Cortadillo Norteño", "Disacada Norteña", "Puerco con Verdolagas", "Costillas en Salsa Verde",
  "Chicharrón en Salsa Verde", "Chicharrón en Salsa Roja", "Picadillo Mexicano", "Ropa Vieja", "Salpicón de Res",
  "Pollo Encacahuatado", "Lomo de Cerdo Adobado", "Albóndigas en Caldo", "Pacholas", "Revolcado",

  // 6. Soups (20)
  "Pozole Rojo de Puerco", "Pozole Blanco de Pollo", "Pozole Verde de Guerrero", "Menudo Rojo", "Menudo Blanco",
  "Birria Consommé", "Sopa de Tortilla", "Sopa de Lima", "Sopa Tarasca", "Sopa de Fideo Seco",
  "Sopa de Mariscos", "Caldo Tlalpeño", "Caldo de Res", "Caldo de Pollo", "Caldo de Camaron",
  "Caldo de Pescado", "Caldo 7 Mares", "Chilpachole de Jaiba", "Crema de Elote", "Crema de Poblano",

  // 7. Breakfast & Eggs (10)
  "Chilaquiles Rojos", "Chilaquiles Verdes", "Huevos Rancheros", "Huevos Divorciados", "Huevos Motuleños",
  "Huevos a la Mexicana", "Huevos con Chorizo", "Huevos con Machaca", "Migas con Huevo", "Chilaquiles Suizos",

  // 8. Tamales (10)
  "Tamales Oaxaqueños", "Tamales Verdes de Pollo", "Tamales Rojos de Puerco", "Tamales de Rajas con Queso", "Tamales de Dulce (Pink)",
  "Tamales de Elote", "Tamales de Mole", "Zacahuil Huasteco", "Corundas Michoacanas", "Uchepos de Michoacan",

  // 9. Desserts (15)
  "Flan Napolitano", "Chocoflan (Imposible)", "Pastel de Tres Leches", "Arroz con Leche", "Jericalla",
  "Capirotada", "Churros con Chocolate", "Buñuelos de Viento", "Pan de Muerto", "Rosca de Reyes",
  "Conchas de Vainilla", "Coyotas de Sonora", "Marquesitas Yucatecas", "Platanos Fritos", "Fresas con Crema",

  // 10. Drinks (10)
  "Agua de Horchata", "Agua de Jamaica", "Agua de Tamarindo", "Champurrado", "Atole de Vainilla",
  "Cafe de Olla", "Margarita Classica", "Paloma", "Michelada", "Mezcal Joven"
];

// Helper to generate a deterministic visual prompt with HYPER VARIANCE
const getImage = (title: string, id: number): string => {
  // Visual Variance Engine 4.0: Poly-Rhythmic Randomization
  // We use array lengths that are coprime (5, 4, 3) to ensure the combination of visual traits 
  // only repeats every 60 items (LCM), maximizing distinctness between similar recipes.

  const angles = [
    "overhead flat lay", 
    "45 degree angle", 
    "extreme macro close up", 
    "straight on view", 
    "low angle heroic shot"
  ]; // Length 5

  const lighting = [
    "natural morning light", 
    "moody cinematic lighting", 
    "bright studio lighting", 
    "golden hour warm lighting"
  ]; // Length 4

  const styles = [
    "rustic wooden table", 
    "modern minimalist plate", 
    "traditional clay pottery"
  ]; // Length 3

  const colors = [
    "vibrant rich colors", 
    "warm earth tones", 
    "fresh green and white tones", 
    "deep contrasty colors",
    "bright high key colors"
  ]; // Length 5

  const textures = [
    "detailed food texture", 
    "steaming hot", 
    "sauce drip detail"
  ]; // Length 3

  const angle = angles[id % angles.length];
  const light = lighting[id % lighting.length];
  const style = styles[id % styles.length];
  const color = colors[id % colors.length];
  const texture = textures[id % textures.length];

  // STRICT PROMPT ENGINEERING: 
  const prompt = `authentic mexican food ${title} ${style} ${angle} ${light} ${color} ${texture} award winning macro photography close up depth of field 8k photorealistic delicious no text no sign no menu no watermark no typography no writing no people`;
  
  // Use a large multiplier to create wide separation between seeds for similar items
  const seed = (id * 987654321 + title.length * 123) % 1000000; 
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&model=flux&seed=${seed}`;
};

// Helper to hydrate the recipe with plausible data
const hydrateRecipe = (title: string, index: number): Recipe => {
  const isDrink = ["Agua", "Margarita", "Paloma", "Michelada", "Atole", "Champurrado", "Cafe", "Chocolate", "Ponche", "Rompope", "Pulque", "Tejuino", "Tepache", "Pozol", "Tascalate", "Charro", "Bandera", "Cantarito", "Mezcal", "Tequila", "Clamato", "Horchata", "Jamaica", "Tamarindo"].some(k => title.includes(k));
  const isDessert = ["Flan", "Pastel", "Arroz con Leche", "Jericalla", "Capirotada", "Churros", "Buñuelos", "Pan", "Conchas", "Orejas", "Coyotas", "Marquesitas", "Platanos", "Fresas", "Mangonada", "Nieves", "Paletas", "Ate", "Glorias", "Jamoncillo", "Mazapan", "Cocadas", "Borrachitos", "Alegrias", "Palanquetas", "Camotes", "Calabaza", "Gorditas de Azucar", "Gelatina", "Carlota"].some(k => title.includes(k));
  const isSoup = ["Sopa", "Caldo", "Crema", "Pozole", "Menudo", "Birria Consommé", "Chilpachole", "Mole de Olla", "Puchero"].some(k => title.includes(k));
  
  let tags = ["Mexican", "Authentic"];
  let difficulty = Difficulty.Medium;
  let prepTime = 30;
  let cookTime = 30;

  if (isDrink) {
    tags.push("Drink", "Beverage");
    difficulty = Difficulty.Easy;
    prepTime = 10;
    cookTime = 5;
  } else if (isDessert) {
    tags.push("Dessert", "Sweet");
    prepTime = 40;
    cookTime = 40;
  } else if (isSoup) {
    tags.push("Soup", "Hot");
    prepTime = 30;
    cookTime = 60;
  } else {
    tags.push("Dinner", "Main Course");
  }

  if (title.includes("Taco")) tags.push("Tacos", "Street Food");
  if (title.includes("Mole")) { tags.push("Mole", "Traditional"); difficulty = Difficulty.Master; cookTime = 120; }
  if (title.includes("Tamal") || title.includes("Zacahuil")) { tags.push("Tamales"); difficulty = Difficulty.Hard; cookTime = 90; }

  return {
    id: (index + 1).toString(),
    title: title,
    description: `Authentic ${title} prepared with traditional techniques and fresh ingredients. A classic staple of Mexican cuisine curated by Chef Rolando.`,
    image: getImage(title, index),
    prepTime,
    cookTime,
    servings: 4,
    difficulty,
    ingredients: [
      { item: "Main Ingredient", amount: "1 kg" },
      { item: "Fresh Herbs", amount: "1 bunch" },
      { item: "Spices", amount: "2 tbsp" },
      { item: "Salsa", amount: "1 cup" }
    ],
    instructions: [
      "Prepare the main ingredients by cleaning and chopping.",
      "Mix the spices and marinate if necessary.",
      "Cook over medium heat until flavors meld.",
      "Serve hot with traditional garnishes."
    ],
    cookingTips: [
      "Use fresh ingredients for best flavor.",
      "Adjust chili level to your taste."
    ],
    nutrition: {
      calories: 350,
      protein: "20g",
      carbs: "30g",
      fats: "15g"
    },
    tags,
    flavorProfile: [
      { name: "Salty", value: 60 },
      { name: "Savory", value: 70 },
      { name: "Spicy", value: isDessert ? 0 : 50 }
    ]
  };
};

export const getRecipes = (): Recipe[] => {
  // STRICTLY RETURN EXACTLY 200 ITEMS
  return DISH_CATALOG.slice(0, 200).map((title, index) => hydrateRecipe(title, index));
};

export default getRecipes;