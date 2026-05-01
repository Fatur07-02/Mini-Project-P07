import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, SafeAreaView,
  KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [notes, setNotes] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const addNote = () => {
    if (inputText.trim() === '') {
      alert('Tulis task dulu ya Bro! 📝');
      return;
    }

    const newNote = {
      id: Date.now(),
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      completed: false // ✅ TAMBAHAN
    };

    setNotes([newNote, ...notes]);
    setInputText('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const clearAll = () => {
    if (notes.length === 0) return;
    alert('Semua task dihapus! 😅');
    setNotes([]);
  };

  // ✅ TAMBAHAN: toggle selesai
  const toggleDone = (id) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, completed: !note.completed } : note
    ));
  };

  // ✅ TAMBAHAN: counter
  const completedCount = notes.filter(n => n.completed).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1117" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >

        {/* HEADER */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.headerTitle}>✅ MyTaskList</Text>

            {notes.length > 0 && (
              <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Hapus Semua</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.headerSubtitle}>
            {completedCount} dari {notes.length} task selesai
          </Text>
        </View>

        {/* INPUT */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              isInputFocused && { borderColor: '#61dafb' }
            ]}
            placeholder="Tulis task kamu..."
            placeholderTextColor="#555"
            value={inputText}
            onChangeText={setInputText}
            multiline={true}
            maxLength={200}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />

          <TouchableOpacity style={styles.addButton} onPress={addNote}>
            <Text style={styles.addButtonText}>+ Tambah</Text>
          </TouchableOpacity>
        </View>

        {/* CHARACTER COUNTER */}
        {inputText.length > 0 && (
          <Text
            style={[
              styles.charCounter,
              { color: inputText.length > 180 ? '#ff5555' : '#8b949e' }
            ]}
          >
            {inputText.length}/200 karakter
          </Text>
        )}

        {/* LIST */}
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.noteCard}>
              
              {/* TAP UNTUK DONE */}
              <TouchableOpacity style={{ flex: 1 }} onPress={() => toggleDone(item.id)}>
                <Text style={[
                  styles.noteText,
                  item.completed && {
                    textDecorationLine: 'line-through',
                    color: '#8b949e'
                  }
                ]}>
                  {item.text}
                </Text>

                <Text style={styles.noteTime}>
                  ⏱ {item.time} {item.completed ? '✅' : ''}
                </Text>
              </TouchableOpacity>

              {/* DELETE */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteNote(item.id)}
              >
                <Text style={styles.deleteButtonText}>🗑</Text>
              </TouchableOpacity>

            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>📭 Belum ada task</Text>
              <Text style={styles.emptySubtext}>Tambah task pertama kamu!</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  container: {
    flex: 1,
  },

  header: {
    padding: 20,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
  },
  headerTitle: {
    color: '#61dafb',
    fontSize: 28,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#8b949e',
    fontSize: 14,
    marginTop: 4,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
  },
  input: {
    flex: 1,
    backgroundColor: '#161b22',
    color: '#f8f8f2',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#30363d',
    maxHeight: 100,
    minHeight: 48,
  },
  addButton: {
    backgroundColor: '#238636',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 48,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },

  charCounter: {
    fontSize: 12,
    paddingHorizontal: 16,
    paddingBottom: 4,
    textAlign: 'right',
  },

  listContent: {
    padding: 16,
    paddingTop: 8,
    flexGrow: 1,
  },

  noteCard: {
    backgroundColor: '#161b22',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#61dafb',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  noteText: {
    color: '#f8f8f2',
    fontSize: 15,
    lineHeight: 22,
  },
  noteTime: {
    color: '#8b949e',
    fontSize: 12,
    marginTop: 6,
  },

  deleteButton: {
    backgroundColor: '#2d1515',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff5555',
  },
  deleteButtonText: {
    fontSize: 16,
  },

  clearButton: {
    backgroundColor: '#2d1515',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff5555',
  },
  clearButtonText: {
    color: '#ff5555',
    fontSize: 12,
    fontWeight: '600',
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: '#8b949e',
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#555',
    fontSize: 14,
  },
});