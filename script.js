const openBtn = document.getElementById('openForm');
const form = document.getElementById('addForm');
const list = document.getElementById('list');
const filter = document.getElementById('filter');
const datalist = document.getElementById('categories');
const suggestions = ['Tecnologia','Moda','Casa','Viagem','Outro'];

function loadItems() {
  const raw = localStorage.getItem('wishItems');
  return raw ? JSON.parse(raw) : [];
}

function saveItems(items) {
  localStorage.setItem('wishItems', JSON.stringify(items));
}

function updateCategoryControls() {
  const items = loadItems();
  const cats = new Set(suggestions);
  items.forEach(i => cats.add(i.category || 'Outro'));

  if (datalist) {
    datalist.innerHTML = '';
    Array.from(cats).sort().forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      datalist.appendChild(opt);
    });
  }

  if (filter) {
    const selected = filter.value || 'all';
    filter.innerHTML = '<option value="all">Todas as categorias</option>';
    Array.from(cats).sort().forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      filter.appendChild(opt);
    });
    if (Array.from(filter.options).some(o => o.value === selected)) filter.value = selected;
  }
}

function renderItem(obj) {
  const item = document.createElement('article');
  item.className = 'item';
  item.dataset.id = obj.id;

  if (obj.image) {
    const img = document.createElement('img');
    img.src = obj.image;
    img.alt = obj.title;
    img.addEventListener('error', () => img.style.display = 'none');
    item.appendChild(img);
  }

  const info = document.createElement('div');
  info.className = 'info';

  // Categoria
  const cat = document.createElement('span');
  cat.className = 'category';
  cat.textContent = obj.category || 'Outro';
  info.appendChild(cat);

  const a = document.createElement('a');
  a.href = obj.link;
  a.textContent = obj.title;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  info.appendChild(a);

  // Pequeno botão/link para abrir o destino (ocupa pouco espaço)
  const openLink = document.createElement('a');
  openLink.href = obj.link;
  openLink.textContent = 'Abrir';
  openLink.className = 'open-link';
  openLink.target = '_blank';
  openLink.rel = 'noopener noreferrer';
  info.appendChild(openLink);

  item.appendChild(info);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove';
  removeBtn.textContent = 'Remover';
  removeBtn.addEventListener('click', () => {
    const remaining = loadItems().filter(i => i.id !== obj.id);
    saveItems(remaining);
    renderAll();
  });
  item.appendChild(removeBtn);

  list.prepend(item);
}

function renderAll() {
  list.innerHTML = '';
  const items = loadItems();
  const sel = filter ? filter.value : 'all';
  items.slice().reverse().forEach(i => {
    if (sel === 'all' || (i.category || 'Outro') === sel) renderItem(i);
  });
  updateCategoryControls();
}

if (openBtn) {
  openBtn.type = 'button';
  openBtn.addEventListener('click', () => {
    if (form.style.display === 'none' || !form.style.display) {
      form.style.display = 'block';
      if (form.title) form.title.focus();
    } else {
      form.style.display = 'none';
    }
  });
}

if (filter) filter.addEventListener('change', renderAll);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = form.title.value.trim();
  const link = form.link.value.trim();
  const category = form.category ? form.category.value.trim() : 'Outro';
  const imageUrl = form.image.value.trim();
  const fileInput = form.imageFile;
  const file = fileInput && fileInput.files && fileInput.files[0];

  if (!title || !link || !category) { alert('Título, link e categoria são obrigatórios'); return; }

  function addWithImage(dataURL) {
    const obj = { id: Date.now().toString(), title, link, image: dataURL || '', category };
    const items = loadItems();
    items.push(obj);
    saveItems(items);
    renderAll();

    form.reset();
    form.title.focus();
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => addWithImage(ev.target.result);
    reader.readAsDataURL(file);
  } else {
    addWithImage(imageUrl || '');
  }
});

// carregar itens salvos ao iniciar
document.addEventListener('DOMContentLoaded', () => {
  updateCategoryControls();
  renderAll();
});