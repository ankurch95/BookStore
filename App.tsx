import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SectionList,
} from 'react-native';
import getItemLayout from 'react-native-section-list-get-item-layout';

const BOOKS = [
  { id: 1, category: "Fiction", title: "The Great Gatsby", author: "F. Scott Fitzgerald", inStock: true },
  { id: 2, category: "Fiction", title: "To Kill a Mockingbird", author: "Harper Lee", inStock: false },
  { id: 3, category: "Non-Fiction", title: "Sapiens:S", author: "Yuval Noah Harari", inStock: true },
  { id: 4, category: "Non-Fiction", title: "Becoming", author: "Michelle Obama", inStock: true },
  { id: 5, category: "Science Fiction", title: "Dune", author: "Frank Herbert", inStock: false },
];

const FilterableBookTable = ({ books }: { books: typeof BOOKS }) => {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortedBooks, setSortedBooks] = useState(books);
  const [newBook, setNewBook] = useState({ id: null, category: "", title: "", author: "", inStock: false });

  const filteredBooks = sortedBooks.filter((book: { title: string, inStock: boolean, author: string, category: string, id: number }) => {
    //  return book.inStock==true
    return book
    /*
    The filteredBooks array contains books from sortedBooks that match the filterText in their title (case-insensitive) and, 
    if the "inStockOnly" flag is set, are in stock. It filters the displayed books based on user input and stock availability.
    */

  });


  const clearFilters = () => {

    /*
    resets the filter and sorting options by clearing the filter text, setting the "In Stock Only" toggle to false, 
    and restoring the book list to its original order from the books array.
    */

  };

  const addBook = () => {
    /*
    Adds a new book to the list of sorted books if it has a title, author, and category, 
    either by generating a new ID or updating an existing book. It then resets the input fields for a new book entry.
    */
    const highestObj = Math.max(...sortedBooks.map(o => o.id));
    const index = sortedBooks.findIndex(o => o.id === highestObj);
    if (newBook.title) {
      if (newBook.author) {
        if (newBook.category) {
          let newBookArr = [...sortedBooks, newBook];
          newBookArr = newBookArr.map(book => ({ ...book, id: book.id ?? index + 2 })); // Assign a default value if id is null
          setSortedBooks(newBookArr);
          setNewBook({ id: null, category: "", title: "", author: "", inStock: false });
        }
      }
    }
  };

  const editBook = () => {
    // Set the newBook state to the details of the book passed as an argument. This allows the user to edit the information of a 
    //selected book by populating the input fields with the book's data, enabling them to make changes and save updates.
  };

  const deleteBook = (id: number) => {
    //Remove a book with a specific ID from the sortedBooks state and update the state with the filtered array of books, effectively deleting the book.
    let data = sortedBooks.filter((book: { id: number }) => book.id !== id);
    setSortedBooks(data);
  };


  const sortBooksAlphabetically = () => {
    const sorted = [...sortedBooks];
    sorted.sort((a, b) => a.title.localeCompare(b.title));
    setSortedBooks(sorted);
  };

  const sectionData = [
    {
      title: 'Books',
      data: filteredBooks,
      // data: BOOKS
    },
  ];

  // Get the item layout for the SectionList
  const getItemLayoutFunc = getItemLayout({
    getItemHeight: (rowData, sectionIndex, rowIndex) => 60,
    getSectionHeaderHeight: () => 40,
    getSectionFooterHeight: () => 0,
  });


  const renderSecHeader = () => {
    return (
      <View style={styles.tableHeader}>
        <View style={styles.headerItem}>
          <Text style={styles.headerText}>Title</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={styles.headerText}>Author</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={styles.headerText}>Category</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={styles.headerText}>In Stock</Text>
        </View>
        <View style={styles.headerItem}>
          <Text style={styles.headerText}>Action</Text>
        </View>
      </View>
    )
  }

  const renderBookItem = ({ item }: { item: typeof BOOKS[number] }) => {
    return (
      <View style={styles.bookRow}>
        <View style={styles.cell}>
          <Text>{item.title}</Text>
        </View>
        <View style={styles.cell}>
          <Text>{item.author}</Text>
        </View>
        <View style={styles.cell}>
          <Text>{item.category}</Text>
        </View>
        <View style={styles.cell}>
          <Text style={item.inStock ? styles.inStock : styles.notInStock}>
            {item.inStock ? 'Yes' : 'No'}
          </Text>
        </View>
        <View style={styles.actionsCell}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => deleteBook(item.id)}
            style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Books</Text>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          testID="searchInput"
          value={filterText}
          onChangeText={setFilterText}
        />
        <TouchableOpacity style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortButton} onPress={sortBooksAlphabetically}>
          <Text style={styles.sortButtonText}>Sort</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toggleContainer}>
        <Text>Show Only in Stock</Text>
        <Switch
          testID="inStockSwitch"
          value={inStockOnly}
          onValueChange={setInStockOnly}
        />
      </View>
      <View style={styles.addBookContainer}>
        <TextInput
          style={styles.addBookInput}
          placeholder="Title"
          value={newBook.title}
          onChangeText={text => setNewBook({ ...newBook, title: text })}
        />
        <TextInput
          style={styles.addBookInput}
          placeholder="Author"
          value={newBook.author}
          onChangeText={text => setNewBook({ ...newBook, author: text })}
        />
        <TextInput
          style={styles.addBookInput}
          placeholder="Category"
          value={newBook.category}
          onChangeText={text => setNewBook({ ...newBook, category: text })}
        />
        <View style={styles.inStockToggleContainer}>
          <Text>In Stock</Text>
          <Switch
            value={newBook.inStock}
            onValueChange={value => setNewBook({ ...newBook, inStock: value })}
          />
        </View>
        <TouchableOpacity
          onPress={() => addBook()}
          style={styles.addButton}>
          <Text style={styles.addButtonText}>{newBook.id ? 'Update' : 'Add'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        style={styles.tableContainer}
      >
        <SectionList
          sections={sectionData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(item) => renderBookItem(item)}
          renderSectionHeader={() => renderSecHeader()}
          getItemLayout={getItemLayoutFunc}
          stickySectionHeadersEnabled={true}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    paddingLeft: 8,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  clearButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginLeft: 8,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sortButton: {
    backgroundColor: 'blue',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginLeft: 8,
  },
  sortButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addBookContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 8,
    marginBottom: 16,
  },
  addBookInput: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    paddingLeft: 8,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 8,
  },
  inStockToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 2,
    maxHeight: 250,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    paddingVertical: 8,
  },
  headerItem: {
    flex: 1,
    paddingHorizontal: 16,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8,
    marginBottom: 8,
    borderRadius: 5,
    elevation: 2,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 16,
    minWidth: 150,
  },
  actionsCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: 'blue',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginTop: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginTop: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inStock: {
    color: 'green',
    fontWeight: 'bold',
  },
  notInStock: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default function App() {
  return <FilterableBookTable books={BOOKS} />;
}
