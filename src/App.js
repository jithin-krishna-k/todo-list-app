import Header from "./Header";
import AddItem from "./AddItem";
import SearchItems from "./SearchItems";
import Content from "./Content";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import apiRequest from "./apiRequest";

function App() {
  const API_URL = " http://localhost:3500/items";
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error("Data not found");
        const listItems = await response.json();
        //console.log(listItems);
        setItems(listItems);
        setFetchError(null);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    setTimeout(() => {
      (async () => await fetchItems())();
    }, 2000);
  }, []);

  const addItem = async (item) => {
    //set unique id
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    //add new item in object type
    const addNewItem = { id, checked: false, item };
    const listItems = [...items, addNewItem];
    setItems(listItems);
    console.log(listItems);

    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addNewItem),
    };
    const result = await apiRequest(API_URL, postOptions);
    if (result) setFetchError(result);
  };

  const handleCheck = async (id) => {
    //console.log(`key ${id}`);
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(listItems);

    const myItem = listItems.filter((item) => item.id === id);
    const updateOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ checked: myItem[0].checked }),
    };
    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, updateOptions);
    if (result) setFetchError(result);
  };

  const handleDelete =async (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);

    const deleteOptions = {method:'DELETE'}
    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, deleteOptions);
    if (result) setFetchError(result);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    //console.log(newItem);
    addItem(newItem);
    setNewItem("");
  };

  return (
    <div className="App">
      <Header title="Todo-list" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItems search={search} setSearch={setSearch} />
      <main>
        {isloading && <p>Loading Items...</p>}
        {fetchError && <p> {`Error : ${fetchError}`} </p>}
        {!isloading && !fetchError && (
          <Content
            items={items.filter((item) =>
              item.item?.toLowerCase().includes(search.toLowerCase())
            )}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />
        )}
      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;
