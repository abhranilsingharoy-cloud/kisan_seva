import re

with open("apps/web/src/app/(app)/resources/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update imports
old_import = "import { StorageTab } from './StorageTab';\nimport { Tractor, Warehouse } from 'lucide-react';"
new_import = "import { StorageTab } from './StorageTab';\nimport { FertiliserTab } from './FertiliserTab';\nimport { Tractor, Warehouse, ShoppingBag } from 'lucide-react';"
content = content.replace(old_import, new_import)

# 2. Update state
old_state = "const [activeTab, setActiveTab] = useState<'rentals' | 'storage'>('rentals');"
new_state = "const [activeTab, setActiveTab] = useState<'rentals' | 'storage' | 'fertiliser'>('fertiliser');"
content = content.replace(old_state, new_state)

# 3. Add Tab Button
old_storage_btn_end = """          >
            <Warehouse size={16} />
            Cold Storage Finder
          </button>
        </div>
      </header>"""

new_tabs_end = """          >
            <Warehouse size={16} />
            Cold Storage Finder
          </button>
          
          <button
            onClick={() => setActiveTab('fertiliser')}
            className={`flex items-center gap-2 pb-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === 'fertiliser'
                ? 'border-indigo-500 text-indigo-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ShoppingBag size={16} />
            Fertiliser Store
          </button>
        </div>
      </header>"""
content = content.replace(old_storage_btn_end, new_tabs_end)

# 4. Add component render
old_render = """      {/* Tab Content */}
      {activeTab === 'rentals' ? <RentalsTab /> : <StorageTab />}
    </div>"""

new_render = """      {/* Tab Content */}
      {activeTab === 'rentals' && <RentalsTab />}
      {activeTab === 'storage' && <StorageTab />}
      {activeTab === 'fertiliser' && <FertiliserTab />}
    </div>"""
content = content.replace(old_render, new_render)

with open("apps/web/src/app/(app)/resources/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated page.tsx")
