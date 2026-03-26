import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp';
import Star from '@mui/icons-material/Star';
import { Checkbox, FormControlLabel, Pagination, Select, MenuItem, Switch } from '@mui/material';

const Collections = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterOptions, setFilterOptions] = useState({ categories: [], origins: [], flavors: [], qualities: [], caffeines: [], allergens: [] });

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState(searchParams.get('category')?.split(',').filter(Boolean) || []);
  const [selectedOrigins, setSelectedOrigins] = useState([]);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [selectedQualities, setSelectedQualities] = useState([]);
  const [selectedCaffeine, setSelectedCaffeine] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [organic, setOrganic] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'createdAt:desc');

  // Collapsible sections
  const [expanded, setExpanded] = useState({ collections: true, origin: false, flavor: false, qualities: false, caffeine: false, allergens: false });

  useEffect(() => {
    api.get('/products/filters').then(({ data }) => setFilterOptions(data)).catch(console.error);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, selectedOrigins, selectedFlavors, selectedQualities, selectedCaffeine, selectedAllergens, organic, sortBy, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, sort: sortBy };
      if (selectedCategories.length) params.category = selectedCategories.join(',');
      if (selectedOrigins.length) params.origin = selectedOrigins.join(',');
      if (selectedFlavors.length) params.flavor = selectedFlavors.join(',');
      if (selectedQualities.length) params.qualities = selectedQualities.join(',');
      if (selectedCaffeine.length) params.caffeine = selectedCaffeine.join(',');
      if (selectedAllergens.length) params.allergens = selectedAllergens.join(',');
      if (organic) params.organic = 'true';

      const { data } = await api.get('/products', { params });
      setProducts(data.products);
      setTotalPages(data.pages);
      setTotalCount(data.total);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (list, setList, value) => {
    if (list.includes(value)) {
      setList(list.filter(v => v !== value));
    } else {
      setList([...list, value]);
    }
    setPage(1);
  };

  const toggleSection = (section) => {
    setExpanded({ ...expanded, [section]: !expanded[section] });
  };

  const FilterSection = ({ title, sectionKey, options, selected, setSelected }) => (
    <div style={{ borderBottom: '1px solid #e5e5e5', paddingBottom: 16, marginBottom: 16 }}>
      <button
        onClick={() => toggleSection(sectionKey)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: expanded[sectionKey] ? 12 : 0 }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: '#1a1a1a' }}>{title}</span>
        {expanded[sectionKey] ? <KeyboardArrowUp style={{ fontSize: 18, color: '#999' }} /> : <KeyboardArrowDown style={{ fontSize: 18, color: '#999' }} />}
      </button>
      {expanded[sectionKey] && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {options.map(opt => (
            <FormControlLabel
              key={opt}
              control={
                <Checkbox
                  checked={selected.includes(opt)}
                  onChange={() => toggleFilter(selected, setSelected, opt)}
                  size="small"
                  sx={{ color: '#ccc', '&.Mui-checked': { color: '#1a1a1a' }, padding: '4px' }}
                />
              }
              label={<span style={{ fontSize: 13, color: '#444' }}>{opt}</span>}
            />
          ))}
        </div>
      )}
    </div>
  );

  // Breadcrumb from category
  const categoryLabel = selectedCategories.length === 1 ? selectedCategories[0].toUpperCase() : 'ALL';

  return (
    <div style={{ backgroundColor: '#fff' }}>
      {/* Page Title */}
      {/* <div style={{ padding: '0 24px', maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 28, fontWeight: 300, color: '#ccc', padding: '24px 0 0', margin: 0 }}>Collections</h1>
      </div> */}

      {/* Banner */}
      <div style={{ margin: '16px 0', height: 308, overflow: 'hidden' }}>
        <img
          src="./collections.jpg"
          alt="Tea Banner"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 24px' }}>
        <span style={{ fontSize: 11, color: '#999' }}>
          <Link to="/" style={{ color: '#999', textDecoration: 'none' }}>HOME</Link>
          {' / '}
          <Link to="/collections" style={{ color: '#999', textDecoration: 'none' }}>COLLECTIONS</Link>
          {selectedCategories.length === 1 && ` / ${categoryLabel}`}
        </span>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 64px', display: 'flex', gap: 40 }}>
        {/* Sidebar Filters */}
        <aside className="hidden md:block" style={{ width: 220, flexShrink: 0 }}>
          <FilterSection title="Collections" sectionKey="collections" options={filterOptions.categories} selected={selectedCategories} setSelected={setSelectedCategories} />
          <FilterSection title="Origin" sectionKey="origin" options={filterOptions.origins} selected={selectedOrigins} setSelected={setSelectedOrigins} />
          <FilterSection title="Flavour" sectionKey="flavor" options={filterOptions.flavors} selected={selectedFlavors} setSelected={setSelectedFlavors} />
          <FilterSection title="Qualities" sectionKey="qualities" options={filterOptions.qualities} selected={selectedQualities} setSelected={setSelectedQualities} />
          <FilterSection title="Caffeine" sectionKey="caffeine" options={filterOptions.caffeines} selected={selectedCaffeine} setSelected={setSelectedCaffeine} />
          <FilterSection title="Allergens" sectionKey="allergens" options={filterOptions.allergens} selected={selectedAllergens} setSelected={setSelectedAllergens} />

          {/* Organic Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: '#1a1a1a' }}>ORGANIC</span>
            <Switch checked={organic} onChange={(e) => { setOrganic(e.target.checked); setPage(1); }} size="small" sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#1a1a1a' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#1a1a1a' } }} />
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1 }}>
          {/* Sort Bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#999' }}>SORT BY</span>
              <Select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                size="small"
                variant="standard"
                sx={{ fontSize: 12, minWidth: 120 }}
              >
                <MenuItem value="createdAt:desc">Newest</MenuItem>
                <MenuItem value="basePrice:asc">Price: Low to High</MenuItem>
                <MenuItem value="basePrice:desc">Price: High to Low</MenuItem>
                <MenuItem value="rating:desc">Top Rated</MenuItem>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ height: 300, backgroundColor: '#f5f5f5', borderRadius: 4 }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
              <p>No products found matching your filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
              {products.map(product => (
                <Link to={`/product/${product._id}`} key={product._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ cursor: 'pointer' }}>
                    <div style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: 4, backgroundColor: '#f9f9f9', marginBottom: 12 }}>
                      <img
                        src={product.images[0] || 'https://via.placeholder.com/300'}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{product.name}</div>
                    <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>{product.description?.substring(0, 40)}...</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
                      €{product.basePrice.toFixed(2)} <span style={{ fontWeight: 400, color: '#999' }}>/ {product.variants?.[0]?.name}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, v) => { setPage(v); window.scrollTo(0, 0); }}
                shape="rounded"
                sx={{ '& .MuiPaginationItem-root': { fontSize: 12 } }}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Collections;
