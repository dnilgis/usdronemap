/**
 * US Drone Map - State Hunting Data
 * Contains hunting seasons, terrain, regulations for all 50 states
 */

const STATES = [
    {
        abbr: 'AL', name: 'Alabama', region: 'Southeast',
        hunting: {
            archeryStart: 'October 15', archeryEnd: 'February 10',
            gunStart: 'November 23', gunEnd: 'February 10',
            terrain: 'Mixed hardwoods, pine plantations, creek bottoms, and agricultural fields',
            topCounties: ['Marengo', 'Dallas', 'Sumter', 'Greene', 'Wilcox', 'Hale', 'Perry', 'Lowndes'],
            notes: 'Alabama has one of the longest deer seasons in the nation. Heavy cover in creek bottoms makes tracking difficult.',
            droneRegs: 'No state restrictions on drone use for deer recovery. Follow FAA Part 107 rules.',
            avgTemp: '45-65°F during peak season',
            bestTime: 'Early morning and late evening flights work best. November rut creates challenging tracking conditions.'
        }
    },
    {
        abbr: 'AK', name: 'Alaska', region: 'Pacific',
        hunting: {
            archeryStart: 'August 1', archeryEnd: 'December 31',
            gunStart: 'August 1', gunEnd: 'December 31',
            terrain: 'Tundra, boreal forest, coastal rainforest, and mountainous terrain',
            topCounties: ['Kenai Peninsula', 'Matanuska-Susitna', 'Fairbanks North Star', 'Kodiak Island'],
            notes: 'Sitka blacktail and mule deer. Remote terrain makes drone recovery especially valuable.',
            droneRegs: 'Special permits may be required in wildlife refuges. Check with ADF&G.',
            avgTemp: '20-45°F during hunting season',
            bestTime: 'Thermal imaging excellent in cold temps. Extended daylight in early season.'
        }
    },
    {
        abbr: 'AZ', name: 'Arizona', region: 'Southwest',
        hunting: {
            archeryStart: 'August 23', archeryEnd: 'September 12',
            gunStart: 'October 25', gunEnd: 'November 10',
            terrain: 'High desert, pine forests, canyon country, and grasslands',
            topCounties: ['Coconino', 'Apache', 'Navajo', 'Gila', 'Yavapai', 'Graham'],
            notes: 'Coues and mule deer. Tag-draw system limits hunters. Rugged terrain benefits from aerial search.',
            droneRegs: 'Prohibited in wilderness areas. Check specific unit regulations.',
            avgTemp: '30-60°F varies by elevation',
            bestTime: 'Early morning best - afternoon thermals can affect flight.'
        }
    },
    {
        abbr: 'AR', name: 'Arkansas', region: 'South',
        hunting: {
            archeryStart: 'September 28', archeryEnd: 'February 28',
            gunStart: 'November 9', gunEnd: 'December 8',
            terrain: 'Ozark Mountains, delta bottomlands, pine forests, and agricultural fields',
            topCounties: ['Pike', 'Howard', 'Polk', 'Montgomery', 'Scott', 'Sebastian', 'Franklin'],
            notes: 'Mix of mountain and delta hunting. Thick oak-hickory forests make traditional tracking tough.',
            droneRegs: 'No state restrictions. Private land permission required.',
            avgTemp: '35-55°F during gun season',
            bestTime: 'Cold fronts during the rut (mid-November) create ideal recovery conditions.'
        }
    },
    {
        abbr: 'CA', name: 'California', region: 'Pacific',
        hunting: {
            archeryStart: 'July 13', archeryEnd: 'September 15',
            gunStart: 'September 21', gunEnd: 'November 3',
            terrain: 'Coastal ranges, oak woodlands, chaparral, and high desert',
            topCounties: ['Tehama', 'Mendocino', 'Lake', 'Shasta', 'Trinity', 'Humboldt', 'Glenn'],
            notes: 'Blacktail and mule deer. Zone-specific seasons. Brush-heavy terrain benefits from thermal.',
            droneRegs: 'Prohibited in state parks and many wilderness areas. Check zone-specific rules.',
            avgTemp: '50-80°F early season, cooler later',
            bestTime: 'Early morning flights essential. Warm afternoon temps reduce thermal effectiveness.'
        }
    },
    {
        abbr: 'CO', name: 'Colorado', region: 'Mountain',
        hunting: {
            archeryStart: 'August 31', archeryEnd: 'September 29',
            gunStart: 'October 12', gunEnd: 'November 17',
            terrain: 'Alpine meadows, aspen groves, pine forests, and high plains',
            topCounties: ['Moffat', 'Rio Blanco', 'Garfield', 'Mesa', 'Montrose', 'Gunnison', 'Eagle'],
            notes: 'Mule deer primary. High altitude and rugged terrain. Early snowfall aids thermal contrast.',
            droneRegs: 'Prohibited in wilderness areas. GMU-specific regulations apply.',
            avgTemp: '20-50°F varies by elevation',
            bestTime: 'Post-snowfall searches highly effective. Altitude affects battery performance.'
        }
    },
    {
        abbr: 'CT', name: 'Connecticut', region: 'Northeast',
        hunting: {
            archeryStart: 'September 15', archeryEnd: 'December 31',
            gunStart: 'November 20', gunEnd: 'December 10',
            terrain: 'Mixed hardwood forests, suburban woodlots, and agricultural edges',
            topCounties: ['Litchfield', 'Windham', 'New London', 'Tolland', 'Middlesex'],
            notes: 'High deer density but fragmented habitat. Many suburban recovery situations.',
            droneRegs: 'Check local ordinances. Some municipalities restrict drone use.',
            avgTemp: '30-50°F during gun season',
            bestTime: 'Leaf-off conditions improve visibility. Cold temps enhance thermal imaging.'
        }
    },
    {
        abbr: 'DE', name: 'Delaware', region: 'Mid-Atlantic',
        hunting: {
            archeryStart: 'September 1', archeryEnd: 'January 31',
            gunStart: 'November 15', gunEnd: 'January 31',
            terrain: 'Coastal plain, agricultural fields, and mixed hardwood swamps',
            topCounties: ['Kent', 'Sussex', 'New Castle'],
            notes: 'Small state with good deer density. Wetland areas challenging for ground tracking.',
            droneRegs: 'No state restrictions. Coastal areas may have federal airspace limitations.',
            avgTemp: '35-50°F during peak season',
            bestTime: 'Swamp and marsh edges excellent for thermal. Morning fog can delay flights.'
        }
    },
    {
        abbr: 'FL', name: 'Florida', region: 'Southeast',
        hunting: {
            archeryStart: 'July 27', archeryEnd: 'October 13',
            gunStart: 'November 2', gunEnd: 'February 2',
            terrain: 'Pine flatwoods, cypress swamps, palmetto thickets, and oak hammocks',
            topCounties: ['Osceola', 'Glades', 'Highlands', 'Polk', 'Levy', 'Dixie', 'Columbia'],
            notes: 'Warm temps challenge thermal imaging. Swamp and palmetto make traditional tracking nearly impossible.',
            droneRegs: 'WMA-specific rules apply. Some areas restrict all aircraft.',
            avgTemp: '55-80°F year-round',
            bestTime: 'Pre-dawn flights critical due to heat. Winter cold fronts create brief windows of better thermal contrast.'
        }
    },
    {
        abbr: 'GA', name: 'Georgia', region: 'Southeast',
        hunting: {
            archeryStart: 'September 14', archeryEnd: 'January 12',
            gunStart: 'October 19', gunEnd: 'January 12',
            terrain: 'Piedmont hardwoods, coastal plains, mountain forests, and pine plantations',
            topCounties: ['Dooly', 'Macon', 'Schley', 'Sumter', 'Taylor', 'Harris', 'Talbot', 'Meriwether'],
            notes: 'Long season with liberal limits. Thick cover in planted pines and swamps.',
            droneRegs: 'No state restrictions. WMA permits required on public land.',
            avgTemp: '40-65°F during peak season',
            bestTime: 'November rut peak. Evening flights after temps drop below 60°F.'
        }
    },
    {
        abbr: 'HI', name: 'Hawaii', region: 'Pacific',
        hunting: {
            archeryStart: 'Year-round', archeryEnd: 'varies by unit',
            gunStart: 'Varies by island', gunEnd: 'varies by unit',
            terrain: 'Tropical forests, volcanic slopes, and grasslands',
            topCounties: ['Hawaii (Big Island)', 'Maui', 'Lanai', 'Molokai'],
            notes: 'Axis deer and blacktail. Unique terrain and regulations. Limited recovery services available.',
            droneRegs: 'Strict regulations near airports and military installations.',
            avgTemp: '60-80°F year-round',
            bestTime: 'Early morning before trade winds pick up. Thermal challenging in warm conditions.'
        }
    },
    {
        abbr: 'ID', name: 'Idaho', region: 'Pacific Northwest',
        hunting: {
            archeryStart: 'August 30', archeryEnd: 'September 30',
            gunStart: 'October 10', gunEnd: 'November 30',
            terrain: 'Mountain forests, sagebrush steppe, river breaks, and wilderness',
            topCounties: ['Idaho', 'Valley', 'Adams', 'Lemhi', 'Custer', 'Boise', 'Clearwater'],
            notes: 'Mule deer and whitetail. Vast wilderness areas. Remote recovery common.',
            droneRegs: 'Prohibited in designated wilderness. National forest regulations vary.',
            avgTemp: '20-45°F during gun season',
            bestTime: 'Snow cover dramatically improves success. Cold temps = excellent thermal contrast.'
        }
    },
    {
        abbr: 'IL', name: 'Illinois', region: 'Midwest',
        hunting: {
            archeryStart: 'October 1', archeryEnd: 'January 19',
            gunStart: 'November 22', gunEnd: 'December 1',
            terrain: 'Agricultural fields, hardwood river bottoms, and bluff country',
            topCounties: ['Pike', 'Adams', 'Brown', 'Schuyler', 'Fulton', 'Jo Daviess', 'Henderson'],
            notes: 'Trophy whitetail destination. Short gun season creates high demand for recovery.',
            droneRegs: 'No state restrictions. Chicago metro area has flight limitations.',
            avgTemp: '25-45°F during gun season',
            bestTime: 'Gun season coincides with ideal thermal conditions. Cold, clear nights best.'
        }
    },
    {
        abbr: 'IN', name: 'Indiana', region: 'Midwest',
        hunting: {
            archeryStart: 'October 1', archeryEnd: 'January 5',
            gunStart: 'November 16', gunEnd: 'December 1',
            terrain: 'Agricultural land, hardwood forests, river valleys, and reclaimed mine land',
            topCounties: ['Parke', 'Putnam', 'Owen', 'Brown', 'Monroe', 'Lawrence', 'Harrison'],
            notes: 'Growing trophy destination. Mix of public and private land hunting.',
            droneRegs: 'No state restrictions. Military airspace in some areas.',
            avgTemp: '30-45°F during gun season',
            bestTime: 'Post-rut gun season ideal. Heavy ag fields allow good aerial views.'
        }
    },
    {
        abbr: 'IA', name: 'Iowa', region: 'Midwest',
        hunting: {
            archeryStart: 'October 1', archeryEnd: 'December 6',
            gunStart: 'December 7', gunEnd: 'December 11',
            terrain: 'River timber, agricultural fields, CRP grasslands, and loess hills',
            topCounties: ['Allamakee', 'Clayton', 'Winneshiek', 'Appanoose', 'Wayne', 'Lucas', 'Decatur'],
            notes: 'Premier trophy whitetail state. Limited tags through lottery. High recovery demand.',
            droneRegs: 'No state restrictions for recovery purposes.',
            avgTemp: '20-40°F during gun season',
            bestTime: 'Cold December temps excellent for thermal. River bottoms hold deer well.'
        }
    },
    {
        abbr: 'KS', name: 'Kansas', region: 'Midwest',
        hunting: {
            archeryStart: 'September 16', archeryEnd: 'December 31',
            gunStart: 'December 4', gunEnd: 'December 15',
            terrain: 'River corridors, agricultural fields, Flint Hills grasslands, and shelter belts',
            topCounties: ['Rooks', 'Osborne', 'Smith', 'Cloud', 'Republic', 'Riley', 'Pottawatomie'],
            notes: 'Big bucks in river corridors. Wind can be challenging for drone ops.',
            droneRegs: 'No state restrictions. Some WIHA areas may have rules.',
            avgTemp: '25-45°F during gun season',
            bestTime: 'Morning lulls between wind events. Shelter belt edges concentrate deer.'
        }
    },
    {
        abbr: 'KY', name: 'Kentucky', region: 'South',
        hunting: {
            archeryStart: 'September 7', archeryEnd: 'January 20',
            gunStart: 'November 9', gunEnd: 'November 24',
            terrain: 'Appalachian foothills, river bottoms, agricultural land, and reclaimed mine land',
            topCounties: ['Henderson', 'Union', 'Christian', 'Hart', 'Metcalfe', 'Green', 'Taylor'],
            notes: 'Underrated whitetail destination. Mix of terrain types. Long archery season.',
            droneRegs: 'No state restrictions. Mammoth Cave area has limitations.',
            avgTemp: '35-50°F during gun season',
            bestTime: 'November gun season overlaps peak rut. Reclaimed land offers open terrain.'
        }
    },
    {
        abbr: 'LA', name: 'Louisiana', region: 'South',
        hunting: {
            archeryStart: 'October 1', archeryEnd: 'January 31',
            gunStart: 'November 16', gunEnd: 'January 31',
            terrain: 'Bottomland hardwoods, cypress swamps, pine forests, and coastal marsh',
            topCounties: ['Tensas', 'Madison', 'East Carroll', 'Concordia', 'Catahoula', 'Avoyelles'],
            notes: 'Swamp hunting common. Flooded timber makes ground tracking nearly impossible.',
            droneRegs: 'WMA-specific rules. Coastal areas may have restrictions.',
            avgTemp: '40-65°F during season',
            bestTime: 'After cold fronts when water levels stable. Cypress swamps excellent for thermal.'
        }
    },
    {
        abbr: 'ME', name: 'Maine', region: 'Northeast',
        hunting: {
            archeryStart: 'September 7', archeryEnd: 'December 14',
            gunStart: 'November 2', gunEnd: 'November 30',
            terrain: 'Northern hardwoods, spruce-fir forests, and logged areas',
            topCounties: ['Aroostook', 'Somerset', 'Piscataquis', 'Penobscot', 'Oxford', 'Franklin'],
            notes: 'Remote wilderness hunting. Early snow common. Large tracts of unorganized territory.',
            droneRegs: 'No state restrictions. Paper company land may have rules.',
            avgTemp: '25-45°F during gun season',
            bestTime: 'Post-snowfall searches ideal. Cold temps excellent for battery life and thermal.'
        }
    },
    {
        abbr: 'MD', name: 'Maryland', region: 'Mid-Atlantic',
        hunting: {
            archeryStart: 'September 6', archeryEnd: 'January 31',
            gunStart: 'November 30', gunEnd: 'December 14',
            terrain: 'Piedmont forests, Eastern Shore agricultural land, and mountain ridges',
            topCounties: ['Dorchester', 'Caroline', 'Talbot', 'Queen Annes', 'Kent', 'Frederick', 'Washington'],
            notes: 'High deer density. Eastern Shore ag land and western mountains offer different terrain.',
            droneRegs: 'DC metro area restrictions. Check county regulations.',
            avgTemp: '30-50°F during gun season',
            bestTime: 'Eastern Shore flat terrain ideal for aerial search. Cold clear mornings best.'
        }
    },
    {
        abbr: 'MA', name: 'Massachusetts', region: 'Northeast',
        hunting: {
            archeryStart: 'October 21', archeryEnd: 'November 30',
            gunStart: 'December 2', gunEnd: 'December 14',
            terrain: 'Mixed hardwood forests, cranberry bogs, and suburban woodlots',
            topCounties: ['Worcester', 'Berkshire', 'Franklin', 'Hampshire', 'Plymouth', 'Bristol'],
            notes: 'High deer density in suburban areas. Fragmented hunting parcels.',
            droneRegs: 'Local ordinances vary significantly. Boston metro restrictions.',
            avgTemp: '30-45°F during gun season',
            bestTime: 'Leaf-off conditions help. Suburban areas require careful airspace awareness.'
        }
    },
    {
        abbr: 'MI', name: 'Michigan', region: 'Midwest',
        hunting: {
            archeryStart: 'October 1', archeryEnd: 'November 14',
            gunStart: 'November 15', gunEnd: 'November 30',
            terrain: 'Northern hardwoods, conifer swamps, agricultural land, and cedar swamps',
            topCounties: ['Leelanau', 'Antrim', 'Missaukee', 'Osceola', 'Clare', 'Gladwin', 'Ogemaw', 'Iosco'],
            notes: 'November 15 opener is a state tradition. High hunting pressure creates recovery demand.',
            droneRegs: 'No state restrictions. State land generally permits recovery operations.',
            avgTemp: '25-40°F during gun season',
            bestTime: 'Opening week cold fronts ideal. Cedar swamps challenging but thermal excels.'
        }
    },
    {
        abbr: 'MN', name: 'Minnesota', region: 'Midwest',
        hunting: {
            archeryStart: 'September 14', archeryEnd: 'December 31',
            gunStart: 'November 9', gunEnd: 'November 17',
            terrain: 'Northern boreal forest, prairie potholes, river valleys, and agricultural land',
            topCounties: ['Houston', 'Fillmore', 'Winona', 'Goodhue', 'Wabasha', 'Mille Lacs', 'Aitkin'],
            notes: 'Strong hunting tradition. Mix of farmland and wilderness. Early cold creates recovery challenges.',
            droneRegs: 'No state restrictions. BWCAW requires special permit.',
            avgTemp: '15-35°F during gun season',
            bestTime: 'Cold temps excellent for thermal. Snow cover dramatically aids recovery.'
        }
    },
    {
        abbr: 'MS', name: 'Mississippi', region: 'South',
        hunting: {
            archeryStart: 'October 1', archeryEnd: 'January 31',
            gunStart: 'November 23', gunEnd: 'December 1',
            terrain: 'Delta bottomlands, pine plantations, mixed hardwoods, and creek bottoms',
            topCounties: ['Wilkinson', 'Claiborne', 'Jefferson', 'Adams', 'Issaquena', 'Warren'],
            notes: 'Long season with liberal limits. Delta hunting in flooded timber.',
            droneRegs: 'WMA-specific rules. No general state restrictions.',
            avgTemp: '40-60°F during peak season',
            bestTime: 'Cold fronts during rut. Delta flooded timber perfect for thermal.'
        }
    },
    {
        abbr: 'MO', name: 'Missouri', region: 'Midwest',
        hunting: {
            archeryStart: 'September 15', archeryEnd: 'January 15',
            gunStart: 'November 16', gunEnd: 'November 26',
            terrain: 'Ozark hills, river bottoms, agricultural land, and mixed hardwoods',
            topCounties: ['Pike', 'Ralls', 'Knox', 'Schuyler', 'Scotland', 'Clark', 'Lewis', 'Marion'],
            notes: 'Trophy potential in northern Missouri. Ozarks offer rugged terrain.',
            droneRegs: 'No state restrictions. Mark Twain National Forest allows recovery.',
            avgTemp: '30-50°F during gun season',
            bestTime: 'Gun season coincides with rut. Clear cold mornings after fronts.'
        }
    },
    {
        abbr: 'MT', name: 'Montana', region: 'Mountain',
        hunting: {
            archeryStart: 'September 7', archeryEnd: 'October 20',
            gunStart: 'October 26', gunEnd: 'December 1',
            terrain: 'Mountain forests, prairie breaks, river bottoms, and high plains',
            topCounties: ['Beaverhead', 'Madison', 'Gallatin', 'Park', 'Carbon', 'Stillwater', 'Fergus'],
            notes: 'Mule deer and whitetail. Vast public land. Remote recovery common.',
            droneRegs: 'Wilderness areas prohibited. National forest regulations apply.',
            avgTemp: '15-40°F during gun season',
            bestTime: 'Post-snowfall ideal. Altitude affects equipment - cold weather prep essential.'
        }
    },
    {
        abbr: 'NE', name: 'Nebraska', region: 'Midwest',
        hunting: {
            archeryStart: 'September 1', archeryEnd: 'December 31',
            gunStart: 'November 16', gunEnd: 'November 24',
            terrain: 'Sandhills grasslands, river corridors, agricultural land, and pine ridges',
            topCounties: ['Cherry', 'Thomas', 'Hooker', 'Grant', 'Custer', 'Buffalo', 'Hall'],
            notes: 'Mule deer in west, whitetail in east. River corridors concentrate deer.',
            droneRegs: 'No state restrictions. Wind is the main operational challenge.',
            avgTemp: '25-45°F during gun season',
            bestTime: 'Morning lulls before wind. Sandhills offer open terrain for aerial search.'
        }
    },
    {
        abbr: 'NV', name: 'Nevada', region: 'Mountain',
        hunting: {
            archeryStart: 'August 10', archeryEnd: 'August 30',
            gunStart: 'October 10', gunEnd: 'November 15',
            terrain: 'High desert, mountain ranges, sagebrush basins, and pinyon-juniper',
            topCounties: ['Elko', 'Humboldt', 'Lander', 'White Pine', 'Lincoln', 'Nye'],
            notes: 'Mule deer. Tag-draw system. Remote hunting. Limited recovery services.',
            droneRegs: 'Federal land regulations apply. Some wilderness restrictions.',
            avgTemp: '25-50°F during season',
            bestTime: 'High desert cools quickly after sunset. Morning flights in canyon country.'
        }
    },
    {
        abbr: 'NH', name: 'New Hampshire', region: 'Northeast',
        hunting: {
            archeryStart: 'September 15', archeryEnd: 'December 15',
            gunStart: 'November 13', gunEnd: 'December 8',
            terrain: 'Northern hardwoods, White Mountain forests, and river valleys',
            topCounties: ['Coos', 'Grafton', 'Carroll', 'Sullivan', 'Cheshire', 'Hillsborough'],
            notes: 'Mountain terrain. Lower deer density than southern states.',
            droneRegs: 'White Mountain NF has some restrictions. No general state restrictions.',
            avgTemp: '25-40°F during gun season',
            bestTime: 'Snow cover aids recovery. Mountain weather can ground drones quickly.'
        }
    },
    {
        abbr: 'NJ', name: 'New Jersey', region: 'Mid-Atlantic',
        hunting: {
            archeryStart: 'September 14', archeryEnd: 'January 31',
            gunStart: 'December 9', gunEnd: 'December 14',
            terrain: 'Pine Barrens, agricultural land, suburban woodlots, and coastal marshes',
            topCounties: ['Sussex', 'Warren', 'Hunterdon', 'Morris', 'Somerset', 'Burlington'],
            notes: 'High deer density. Suburban hunting common. Pine Barrens unique terrain.',
            droneRegs: 'Local ordinances vary widely. Coastal areas have restrictions.',
            avgTemp: '30-45°F during gun season',
            bestTime: 'Pine Barrens offer good visibility. Suburban areas require careful planning.'
        }
    },
    {
        abbr: 'NM', name: 'New Mexico', region: 'Southwest',
        hunting: {
            archeryStart: 'September 1', archeryEnd: 'September 24',
            gunStart: 'October 15', gunEnd: 'November 30',
            terrain: 'High desert, mountain forests, mesas, and canyon country',
            topCounties: ['Catron', 'Socorro', 'Sierra', 'Lincoln', 'Otero', 'Colfax', 'Rio Arriba'],
            notes: 'Mule deer and Coues deer. Draw system. High elevation hunting.',
            droneRegs: 'Wilderness restrictions apply. Some tribal land prohibits drones.',
            avgTemp: '25-55°F varies by elevation',
            bestTime: 'High altitude requires cold weather prep. Morning flights before thermals.'
        }
    },
    {
        abbr: 'NY', name: 'New York', region: 'Mid-Atlantic',
        hunting: {
            archeryStart: 'October 1', archeryEnd: 'December 20',
            gunStart: 'November 16', gunEnd: 'December 8',
            terrain: 'Adirondack forests, agricultural land, Catskill Mountains, and Southern Tier hardwoods',
            topCounties: ['Steuben', 'Allegany', 'Cattaraugus', 'Wyoming', 'Livingston', 'Tioga', 'Chemung'],
            notes: 'Large deer population. Mix of public and private land. Southern Tier trophy potential.',
            droneRegs: 'Adirondack Park has restrictions. NYC metro area limitations.',
            avgTemp: '25-40°F during gun season',
            bestTime: 'Post-snowfall Adirondack searches. Southern Tier rolling hills ideal for aerial.'
        }
    },
    {
        abbr: 'NC', name: 'North Carolina', region: 'Southeast',
        hunting: {
            archeryStart: 'September 14', archeryEnd: 'January 1',
            gunStart: 'October 12', gunEnd: 'January 1',
            terrain: 'Coastal swamps, Piedmont forests, mountain ridges, and agricultural land',
            topCounties: ['Hyde', 'Tyrrell', 'Washington', 'Beaufort', 'Pamlico', 'Bladen', 'Duplin'],
            notes: 'Coastal plain offers unique hunting. Pocosins and swamps challenge tracking.',
            droneRegs: 'Gamelands have specific rules. Coastal refuge areas restricted.',
            avgTemp: '35-55°F during peak season',
            bestTime: 'Coastal swamp recovery ideal for thermal. Mountain recovery requires weather flexibility.'
        }
    },
    {
        abbr: 'ND', name: 'North Dakota', region: 'Midwest',
        hunting: {
            archeryStart: 'September 1', archeryEnd: 'January 5',
            gunStart: 'November 8', gunEnd: 'November 24',
            terrain: 'River breaks, agricultural land, prairie potholes, and Badlands',
            topCounties: ['Pembina', 'Cavalier', 'Rolette', 'Bottineau', 'Renville', 'Burke'],
            notes: 'Mule deer in west, whitetail throughout. River corridors key. Cold winters.',
            droneRegs: 'No state restrictions. Federal grassland regulations apply.',
            avgTemp: '15-35°F during gun season',
            bestTime: 'Extreme cold excellent for thermal. Wind is primary operational challenge.'
        }
    },
    {
        abbr: 'OH', name: 'Ohio', region: 'Midwest',
        hunting: {
            archeryStart: 'September 28', archeryEnd: 'February 2',
            gunStart: 'December 2', gunEnd: 'December 8',
            terrain: 'Agricultural land, hardwood forests, reclaimed mine land, and river valleys',
            topCounties: ['Coshocton', 'Tuscarawas', 'Guernsey', 'Noble', 'Monroe', 'Belmont', 'Harrison'],
            notes: 'Growing trophy destination. Reclaimed strip mine land offers unique terrain.',
            droneRegs: 'No state restrictions. Urban areas have local regulations.',
            avgTemp: '30-45°F during gun season',
            bestTime: 'December cold ideal. Reclaimed land offers open terrain for aerial search.'
        }
    },
    {
        abbr: 'OK', name: 'Oklahoma', region: 'South',
        hunting: {
            archeryStart: 'October 1', archeryEnd: 'January 15',
            gunStart: 'November 23', gunEnd: 'December 8',
            terrain: 'Cross Timbers oak forests, prairie, river bottoms, and mountain forests',
            topCounties: ['Pushmataha', 'Le Flore', 'McCurtain', 'Latimer', 'Pittsburg', 'Hughes'],
            notes: 'Underrated whitetail state. Southeast mountains hold big bucks.',
            droneRegs: 'No state restrictions. WMA rules vary.',
            avgTemp: '35-55°F during gun season',
            bestTime: 'Cross Timbers brush benefits from thermal. Morning flights before wind.'
        }
    },
    {
        abbr: 'OR', name: 'Oregon', region: 'Pacific Northwest',
        hunting: {
            archeryStart: 'August 24', archeryEnd: 'September 27',
            gunStart: 'October 5', gunEnd: 'November 8',
            terrain: 'Coastal rainforest, Cascade forests, high desert, and agricultural valleys',
            topCounties: ['Lake', 'Harney', 'Malheur', 'Baker', 'Wallowa', 'Grant', 'Umatilla'],
            notes: 'Blacktail west, mule deer east. Diverse terrain and seasons.',
            droneRegs: 'Wilderness restrictions. Some BLM land has seasonal closures.',
            avgTemp: '30-55°F varies by region',
            bestTime: 'Eastern Oregon high desert cools quickly. Coastal hunts challenging due to rain.'
        }
    },
    {
        abbr: 'PA', name: 'Pennsylvania', region: 'Mid-Atlantic',
        hunting: {
            archeryStart: 'October 5', archeryEnd: 'November 16',
            gunStart: 'November 30', gunEnd: 'December 14',
            terrain: 'Mountain ridges, agricultural valleys, hardwood forests, and state gamelands',
            topCounties: ['Potter', 'Tioga', 'Clinton', 'Lycoming', 'Cameron', 'Elk', 'Sullivan', 'Bradford'],
            notes: 'Massive hunter participation. Big woods hunting tradition. Challenging terrain.',
            droneRegs: 'State gamelands generally permit recovery. Local regs in populated areas.',
            avgTemp: '25-40°F during gun season',
            bestTime: 'Cold mountain mornings ideal. Leaf-off conditions help visibility.'
        }
    },
    {
        abbr: 'RI', name: 'Rhode Island', region: 'Northeast',
        hunting: {
            archeryStart: 'September 15', archeryEnd: 'January 31',
            gunStart: 'December 7', gunEnd: 'January 31',
            terrain: 'Mixed hardwoods, coastal areas, and suburban woodlots',
            topCounties: ['Washington', 'Kent', 'Providence', 'Newport', 'Bristol'],
            notes: 'Small state with limited hunting areas. High deer density in some zones.',
            droneRegs: 'Local ordinances vary. Coastal and urban restrictions.',
            avgTemp: '30-45°F during gun season',
            bestTime: 'Small parcels require careful flight planning. Morning flights preferred.'
        }
    },
    {
        abbr: 'SC', name: 'South Carolina', region: 'Southeast',
        hunting: {
            archeryStart: 'September 15', archeryEnd: 'January 1',
            gunStart: 'October 11', gunEnd: 'January 1',
            terrain: 'Coastal lowcountry, Piedmont forests, Sandhills, and mountain foothills',
            topCounties: ['Allendale', 'Hampton', 'Jasper', 'Colleton', 'Beaufort', 'Williamsburg'],
            notes: 'Long season with liberal limits. Lowcountry swamps challenging for ground tracking.',
            droneRegs: 'WMA-specific rules. Coastal refuges restricted.',
            avgTemp: '40-60°F during peak season',
            bestTime: 'Lowcountry swamps perfect for thermal. Cold front pushes improve deer movement.'
        }
    },
    {
        abbr: 'SD', name: 'South Dakota', region: 'Midwest',
        hunting: {
            archeryStart: 'September 1', archeryEnd: 'January 1',
            gunStart: 'November 16', gunEnd: 'December 1',
            terrain: 'Prairie grasslands, Black Hills forests, river breaks, and agricultural land',
            topCounties: ['Harding', 'Perkins', 'Butte', 'Meade', 'Pennington', 'Custer', 'Gregory'],
            notes: 'Mule deer in west, whitetail east. Black Hills unique terrain. Cold winters.',
            droneRegs: 'Black Hills NF allows recovery. No general state restrictions.',
            avgTemp: '20-40°F during gun season',
            bestTime: 'Snow cover aids recovery dramatically. Wind is main operational challenge.'
        }
    },
    {
        abbr: 'TN', name: 'Tennessee', region: 'South',
        hunting: {
            archeryStart: 'September 28', archeryEnd: 'January 10',
            gunStart: 'November 23', gunEnd: 'January 5',
            terrain: 'Appalachian Mountains, river valleys, agricultural land, and hardwood forests',
            topCounties: ['Fayette', 'Haywood', 'Madison', 'Henderson', 'Carroll', 'Humphreys', 'Hickman'],
            notes: 'Growing trophy destination. Mix of terrain types. Strong hunting culture.',
            droneRegs: 'WMA rules vary. Great Smoky Mountains NP prohibited.',
            avgTemp: '35-55°F during gun season',
            bestTime: 'Mountain recovery requires weather awareness. Valley ag land offers open terrain.'
        }
    },
    {
        abbr: 'TX', name: 'Texas', region: 'South',
        hunting: {
            archeryStart: 'October 1', archeryEnd: 'November 1',
            gunStart: 'November 2', gunEnd: 'January 5',
            terrain: 'Hill Country, South Texas brush, Piney Woods, Rolling Plains, and Trans-Pecos',
            topCounties: ['Webb', 'Duval', 'Jim Hogg', 'Zapata', 'Maverick', 'Dimmit', 'La Salle', 'McMullen'],
            notes: 'Largest deer herd in US. South Texas brush country legendary. Mostly private land.',
            droneRegs: 'No state restrictions. Military airspace in some areas.',
            avgTemp: '40-70°F varies by region',
            bestTime: 'South Texas brush perfect for thermal - nearly impossible to track on ground.'
        }
    },
    {
        abbr: 'UT', name: 'Utah', region: 'Mountain',
        hunting: {
            archeryStart: 'August 17', archeryEnd: 'September 13',
            gunStart: 'October 19', gunEnd: 'October 27',
            terrain: 'High mountain forests, desert canyons, sagebrush flats, and alpine meadows',
            topCounties: ['Carbon', 'Emery', 'Garfield', 'Kane', 'Wayne', 'San Juan', 'Duchesne'],
            notes: 'Mule deer primary. Limited entry units for trophy potential. High elevation hunting.',
            droneRegs: 'National park areas prohibited. National forest regulations apply.',
            avgTemp: '25-50°F varies by elevation',
            bestTime: 'Early snow aids recovery. Canyon country offers unique thermal opportunities.'
        }
    },
    {
        abbr: 'VT', name: 'Vermont', region: 'Northeast',
        hunting: {
            archeryStart: 'October 1', archeryEnd: 'December 15',
            gunStart: 'November 16', gunEnd: 'December 1',
            terrain: 'Green Mountain forests, agricultural valleys, and northern hardwoods',
            topCounties: ['Essex', 'Orleans', 'Caledonia', 'Lamoille', 'Franklin', 'Addison'],
            notes: 'Mountain hunting tradition. Lower deer density. Remote recovery situations.',
            droneRegs: 'Green Mountain NF allows recovery. No general state restrictions.',
            avgTemp: '25-40°F during gun season',
            bestTime: 'Snow cover common and helpful. Mountain weather can ground operations.'
        }
    },
    {
        abbr: 'VA', name: 'Virginia', region: 'Mid-Atlantic',
        hunting: {
            archeryStart: 'October 5', archeryEnd: 'January 4',
            gunStart: 'November 16', gunEnd: 'January 4',
            terrain: 'Blue Ridge Mountains, Piedmont forests, Tidewater swamps, and agricultural land',
            topCounties: ['Bath', 'Highland', 'Craig', 'Rockbridge', 'Augusta', 'Buckingham', 'Appomattox'],
            notes: 'Diverse terrain from mountains to coast. Strong hunting tradition.',
            droneRegs: 'National forest and park areas have restrictions. Shenandoah NP prohibited.',
            avgTemp: '30-50°F during gun season',
            bestTime: 'Mountain cold fronts ideal. Tidewater swamps excellent for thermal recovery.'
        }
    },
    {
        abbr: 'WA', name: 'Washington', region: 'Pacific Northwest',
        hunting: {
            archeryStart: 'September 1', archeryEnd: 'September 30',
            gunStart: 'October 12', gunEnd: 'November 8',
            terrain: 'Cascade forests, eastern sagebrush, coastal rainforest, and agricultural valleys',
            topCounties: ['Okanogan', 'Ferry', 'Stevens', 'Pend Oreille', 'Spokane', 'Kittitas', 'Yakima'],
            notes: 'Mule deer east, blacktail west. Varied terrain and seasons.',
            droneRegs: 'Wilderness areas prohibited. National forest regulations apply.',
            avgTemp: '30-50°F varies by region',
            bestTime: 'Eastern WA high desert cools quickly. Cascade rain can ground operations.'
        }
    },
    {
        abbr: 'WV', name: 'West Virginia', region: 'Mid-Atlantic',
        hunting: {
            archeryStart: 'September 28', archeryEnd: 'December 31',
            gunStart: 'November 25', gunEnd: 'December 8',
            terrain: 'Appalachian Mountains, river valleys, and mixed hardwood forests',
            topCounties: ['Pendleton', 'Randolph', 'Pocahontas', 'Webster', 'Nicholas', 'Greenbrier'],
            notes: 'Mountain hunting tradition. Rugged terrain. Buck-only gun season. Trophy potential.',
            droneRegs: 'National forest allows recovery operations. No general state restrictions.',
            avgTemp: '30-45°F during gun season',
            bestTime: 'Mountain terrain benefits from thermal. Post-snowfall ideal conditions.'
        }
    },
    {
        abbr: 'WI', name: 'Wisconsin', region: 'Midwest',
        hunting: {
            archeryStart: 'September 14', archeryEnd: 'January 5',
            gunStart: 'November 23', gunEnd: 'December 1',
            terrain: 'Northern hardwoods, agricultural land, wetlands, and conifer swamps',
            topCounties: ['Buffalo', 'Trempealeau', 'Richland', 'Vernon', 'Crawford', 'Iowa', 'Grant', 'Lafayette'],
            notes: 'Strong hunting culture. Opening day is a state tradition. Diverse terrain throughout.',
            droneRegs: 'No state restrictions for recovery. DNR generally supports recovery efforts.',
            avgTemp: '20-40°F during gun season',
            bestTime: 'Gun season opener often has snow. Cold temps excellent for thermal imaging.'
        }
    },
    {
        abbr: 'WY', name: 'Wyoming', region: 'Mountain',
        hunting: {
            archeryStart: 'September 1', archeryEnd: 'September 30',
            gunStart: 'October 1', gunEnd: 'November 30',
            terrain: 'Mountain forests, sagebrush basins, river breaks, and high plains',
            topCounties: ['Sublette', 'Lincoln', 'Teton', 'Fremont', 'Park', 'Hot Springs', 'Washakie'],
            notes: 'Mule deer and whitetail. Vast public land. Remote hunting. Long distances.',
            droneRegs: 'Wilderness areas prohibited. National forest regulations apply. Wind is major factor.',
            avgTemp: '15-40°F during season',
            bestTime: 'Post-snowfall ideal. High altitude and wind require careful planning.'
        }
    }
];

// Top hunting states for county-level pages
const TOP_HUNTING_STATES = ['WI', 'MI', 'MN', 'TX', 'PA', 'OH', 'IL', 'IA', 'MO', 'GA'];

// Services configuration
const SERVICES = [
    {
        slug: 'deer-recovery',
        name: 'Deer Recovery Services',
        shortName: 'Deer Recovery',
        icon: '🦌',
        color: '#78350f',
        directoryService: 'Game Recovery'
    },
    {
        slug: 'agriculture',
        name: 'Agricultural Drone Services',
        shortName: 'Ag Spraying',
        icon: '🌾',
        color: '#166534',
        directoryService: 'Ag Spraying'
    },
    {
        slug: 'game-recovery',
        name: 'Game Recovery Services',
        shortName: 'Game Recovery',
        icon: '🎯',
        color: '#1e3a2f',
        directoryService: 'Game Recovery'
    }
];

module.exports = { STATES, TOP_HUNTING_STATES, SERVICES };
