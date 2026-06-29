import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Modal,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/useUserStore";
import "@/types/navigation";

interface LessonModule {
  id: number;
  title: string;
  desc: string;
  duration: string;
  xp: string;
  xpVal: number;
  content: string[];
  audioUrl?: string;
}
import { LESSON_MODULES } from "@/data/lessons";

export default function LearnScreen() {
  const userName = useUserStore((s) => s.name);
  const isPremium = useUserStore((s) => s.isPremium);
  const lessonsCompleted = useUserStore((s) => s.lessonsCompleted);

  // Expanded card tracking
  const [expandedLessonId, setExpandedLessonId] = useState<number | null>(null);

  // Lesson Reading Modal State
  const [readingLesson, setReadingLesson] = useState<LessonModule | null>(null);

  // Audio Player State
  const [activeAudioLesson, setActiveAudioLesson] = useState<LessonModule | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Download simulation state
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedIds, setDownloadedIds] = useState<Set<number>>(new Set());

  // Certificate Modal State
  const [certModalVisible, setCertModalVisible] = useState(false);

  const handleLessonComplete = (lesson: LessonModule) => {
    // If the completed lesson count is less than the lesson id, increment it
    if (lessonsCompleted < lesson.id) {
      const store = useUserStore.getState();
      store.incrementLessons();
      store.addXp(lesson.xpVal);
    }
    setReadingLesson(null);
  };

  const handleToggleExpand = (id: number) => {
    setExpandedLessonId(expandedLessonId === id ? null : id);
  };

  const handleStartAudio = (lesson: LessonModule) => {
    if (!isPremium) {
      router.push("/paywall");
      return;
    }
    setActiveAudioLesson(lesson);
    setIsPlayingAudio(true);
  };

  const handleDownload = (id: number) => {
    if (!isPremium) {
      router.push("/paywall");
      return;
    }
    if (downloadedIds.has(id)) {
      // Remove download
      const copy = new Set(downloadedIds);
      copy.delete(id);
      setDownloadedIds(copy);
      return;
    }

    setDownloadingId(id);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingId(null);
          setDownloadedIds(new Set([...downloadedIds, id]));
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleShowCertificate = () => {
    if (!isPremium) {
      router.push("/paywall");
      return;
    }
    setCertModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Learn Finance</Text>
          <Text style={styles.headerSubtitle}>
            {"Master personal finance through interactive syllabus pathways"}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Certificate Progress Card */}
        <View style={styles.certCard}>
          <View style={styles.certHeader}>
            <View style={styles.certBadge}>
              <Ionicons name="ribbon-outline" size={16} color="#15803d" />
              <Text style={styles.certBadgeText}>ACCREDITED PATHWAY</Text>
            </View>
            <Text style={styles.certProgressText}>
              {lessonsCompleted}/4 Completed
            </Text>
          </View>
          <Text style={styles.certTitle}>Financial Literacy Certificate</Text>
          <Text style={styles.certDesc}>
            Complete all modules to generate and download your verified FinLit certificate.
          </Text>
          
          {/* Progress bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(lessonsCompleted / 4) * 100}%` },
              ]}
            />
          </View>

          {lessonsCompleted === 4 ? (
            <Pressable
              onPress={handleShowCertificate}
              style={styles.certButton}
            >
              <Ionicons name="ribbon" size={20} color="white" />
              <Text style={styles.certButtonText}>
                {isPremium ? "View Certificate" : "Unlock Verified Certificate"}
              </Text>
              {!isPremium && (
                <Ionicons name="lock-closed" size={14} color="white" style={{ marginLeft: 6 }} />
              )}
            </Pressable>
          ) : (
            <View style={styles.disabledCertButton}>
              <Text style={styles.disabledCertText}>
                Complete all modules to unlock certification
              </Text>
            </View>
          )}
        </View>

        {/* Modules List */}
        <Text style={styles.sectionLabel}>MODULE CURRICULUM</Text>
        <View style={styles.modulesContainer}>
          {LESSON_MODULES.map((mod) => {
            const isCompleted = lessonsCompleted >= mod.id;
            const isExpanded = expandedLessonId === mod.id;
            const isDownloading = downloadingId === mod.id;
            const isDownloaded = downloadedIds.has(mod.id);

            return (
              <View
                key={mod.id}
                style={[
                  styles.moduleCard,
                  isCompleted && styles.completedModuleCard,
                ]}
              >
                <Pressable
                  onPress={() => handleToggleExpand(mod.id)}
                  style={styles.moduleHeaderRow}
                >
                  <View style={styles.moduleMeta}>
                    <View style={styles.badgeRow}>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: isCompleted ? "#e0f2fe" : "#f3f4f6" },
                        ]}
                      >
                        <Text style={{ fontSize: 10, fontWeight: "800", color: isCompleted ? "#0369a1" : "#4b5563" }}>
                          {isCompleted ? "COMPLETED" : "IN PROGRESS"}
                        </Text>
                      </View>
                      <Text style={styles.durationText}>
                        {mod.duration} • {mod.xp}
                      </Text>
                    </View>
                    <Text style={styles.moduleCardTitle}>{mod.title}</Text>
                  </View>
                  <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6b7280"
                  />
                </Pressable>

                {/* Expanded contents */}
                {isExpanded && (
                  <View style={styles.moduleExpandedBody}>
                    <Text style={styles.moduleCardDesc}>{mod.desc}</Text>
                    
                    {/* Action buttons */}
                    <View style={styles.actionRow}>
                      <Pressable
                        onPress={() => setReadingLesson(mod)}
                        style={styles.readBtn}
                      >
                        <Ionicons name={"book-open-outline" as any} size={16} color="white" />
                        <Text style={styles.readBtnText}>Read Lesson</Text>
                      </Pressable>

                      <Pressable
                        onPress={() => handleStartAudio(mod)}
                        style={styles.audioBtn}
                      >
                        <Ionicons
                          name={isPremium ? "volume-high-outline" : "lock-closed-outline"}
                          size={16}
                          color="#15803d"
                        />
                        <Text style={styles.audioBtnText}>Listen Audio</Text>
                      </Pressable>

                      <Pressable
                        onPress={() => handleDownload(mod.id)}
                        disabled={isDownloading}
                        style={styles.downloadBtn}
                      >
                        {isDownloading ? (
                          <ActivityIndicator size="small" color="#4b5563" />
                        ) : (
                          <>
                            <Ionicons
                              name={
                                isDownloaded
                                  ? "checkmark-circle"
                                  : isPremium
                                  ? "cloud-download-outline"
                                  : "lock-closed-outline"
                              }
                              size={16}
                              color="#4b5563"
                            />
                            <Text style={styles.downloadBtnText}>
                              {isDownloaded ? "Saved" : "Offline"}
                            </Text>
                          </>
                        )}
                      </Pressable>
                    </View>

                    {/* Download percentage spinner */}
                    {isDownloading && (
                      <Text style={styles.progressSub}>
                        Downloading offline data: {downloadProgress}%
                      </Text>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ── AUDIO PLAYER MINI DASHBOARD ── */}
      {activeAudioLesson && (
        <View style={styles.audioPlayerDashboard}>
          <View style={styles.playerDetails}>
            <View style={styles.playerIconBox}>
              <Ionicons name="headset" size={20} color="white" />
            </View>
            <View style={styles.playerTextWrap}>
              <Text style={styles.playerTitle} numberOfLines={1}>
                {activeAudioLesson.title}
              </Text>
              <Text style={styles.playerSubtitle}>
                {isPlayingAudio ? "Playing Audio Lesson..." : "Paused"}
              </Text>
            </View>
          </View>
          <View style={styles.playerControls}>
            <Pressable
              onPress={() => setIsPlayingAudio(!isPlayingAudio)}
              style={styles.playPauseBtn}
            >
              <Ionicons
                name={isPlayingAudio ? "pause" : "play"}
                size={22}
                color="#15803d"
              />
            </Pressable>
            <Pressable
              onPress={() => setActiveAudioLesson(null)}
              style={styles.closePlayerBtn}
            >
              <Ionicons name="close" size={20} color="#9ca3af" />
            </Pressable>
          </View>
        </View>
      )}

      {/* ── LESSON READING OVERLAY MODAL ── */}
      <Modal
        visible={!!readingLesson}
        animationType="slide"
        onRequestClose={() => setReadingLesson(null)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
          {readingLesson && (
            <View style={{ flex: 1 }}>
              {/* Header */}
              <View style={styles.readingHeader}>
                <Pressable
                  onPress={() => setReadingLesson(null)}
                  style={styles.readingBack}
                >
                  <Ionicons name="arrow-back" size={22} color="#4b5563" />
                </Pressable>
                <Text style={styles.readingTitle} numberOfLines={1}>
                  {readingLesson.title}
                </Text>
                <View style={{ width: 40 }} />
              </View>

              <ScrollView style={{ flex: 1, padding: 24 }}>
                <Text style={styles.readingIntro}>MODULE CONTENTS</Text>
                {readingLesson.content.map((paragraph, index) => (
                  <Text key={index} style={styles.readingParagraph}>
                    {paragraph}
                  </Text>
                ))}
              </ScrollView>

              {/* Mark Completed Button */}
              <View style={styles.readingFooter}>
                <Pressable
                  onPress={() => handleLessonComplete(readingLesson)}
                  style={styles.completeBtn}
                >
                  <Text style={styles.completeBtnText}>
                    Mark Lesson as Completed
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* ── PREMIUM CERTIFICATE MODAL ── */}
      <Modal
        visible={certModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setCertModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.certModalCard}>
            {/* Stamp seal details */}
            <View style={styles.certModalHeader}>
              <Text style={styles.certBrand}>FINLIT ACADEMY</Text>
              <Pressable
                onPress={() => setCertModalVisible(false)}
                style={styles.closeCertBtn}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            {/* Main Certificate Scrollable */}
            <ScrollView
              contentContainerStyle={styles.certContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.goldBorder}>
                <View style={styles.innerCertBody}>
                  <Ionicons name="ribbon" size={64} color="#b45309" style={{ marginBottom: 12 }} />
                  <Text style={styles.certMainTitle}>CERTIFICATE OF COMPLETION</Text>
                  <Text style={styles.certSubText}>This is proudly presented to</Text>
                  <Text style={styles.certRecipientName}>{userName}</Text>
                  <Text style={styles.certParagraph}>
                    {"for successfully completing all advanced modules in the FinLit Financial Literacy program, covering MoMo budget audits, local Treasury Bill investments, commercial debt management, and SSNIT retirement schemes."}
                  </Text>

                  <View style={styles.certSignatures}>
                    <View style={styles.signatureLine}>
                      <Text style={styles.signText}>FinLit Director</Text>
                      <View style={styles.lineSpacer} />
                      <Text style={styles.signTitle}>Kofi Mensah</Text>
                    </View>
                    <View style={styles.signatureLine}>
                      <Text style={styles.signText}>Verification Seal</Text>
                      <View style={styles.lineSpacer} />
                      <Text style={styles.signTitle}>ID: FL-2026-GRA</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>

            <Pressable
              onPress={() => setCertModalVisible(false)}
              style={styles.downloadFileBtn}
            >
              <Ionicons name="download-outline" size={18} color="white" />
              <Text style={styles.downloadFileBtnText}>Download PDF Certificate</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0f172a",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 3,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },

  /* Certificate Card */
  certCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  certHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  certBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ccfbf1",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  certBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#0d9488",
  },
  certProgressText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4b5563",
  },
  certTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginTop: 14,
  },
  certDesc: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    lineHeight: 16,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#f3f4f6",
    borderRadius: 3,
    marginTop: 16,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#0d9488",
  },
  certButton: {
    backgroundColor: "#0d9488",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 20,
  },
  certButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 6,
  },
  disabledCertButton: {
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    paddingVertical: 12,
    marginTop: 20,
    alignItems: "center",
  },
  disabledCertText: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "700",
  },

  /* Section Labels */
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#9ca3af",
    letterSpacing: 1.2,
    marginTop: 28,
    marginBottom: 12,
    marginLeft: 2,
  },

  /* Modules Container */
  modulesContainer: {
    gap: 12,
  },
  moduleCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  completedModuleCard: {
    borderColor: "#dcfce7",
  },
  moduleHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  moduleMeta: {
    flex: 1,
    marginRight: 10,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
  },
  moduleCardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2937",
    marginTop: 8,
  },
  moduleExpandedBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 12,
  },
  moduleCardDesc: {
    fontSize: 13,
    color: "#4b5563",
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  readBtn: {
    flex: 1.2,
    backgroundColor: "#0d9488",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 4,
  },
  readBtnText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },
  audioBtn: {
    flex: 1,
    backgroundColor: "#ccfbf1",
    borderWidth: 1,
    borderColor: "#99f6e4",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 4,
  },
  audioBtnText: {
    color: "#0d9488",
    fontSize: 11,
    fontWeight: "700",
  },
  downloadBtn: {
    flex: 0.8,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 4,
  },
  downloadBtnText: {
    color: "#4b5563",
    fontSize: 11,
    fontWeight: "700",
  },
  progressSub: {
    fontSize: 10,
    color: "#4b5563",
    fontWeight: "700",
    marginTop: 8,
    textAlign: "right",
  },

  /* Audio player mini dashboard */
  audioPlayerDashboard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  playerDetails: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  playerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#0d9488",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  playerTextWrap: {
    flex: 1,
  },
  playerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f172a",
  },
  playerSubtitle: {
    fontSize: 11,
    color: "#0d9488",
    fontWeight: "700",
    marginTop: 2,
  },
  playerControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  playPauseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ccfbf1",
    alignItems: "center",
    justifyContent: "center",
  },
  closePlayerBtn: {
    padding: 4,
  },

  /* Reading modal */
  readingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  readingBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  readingTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    flex: 1,
    textAlign: "center",
  },
  readingIntro: {
    fontSize: 10,
    fontWeight: "800",
    color: "#9ca3af",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  readingParagraph: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: "500",
  },
  readingFooter: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  completeBtn: {
    backgroundColor: "#0d9488",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  completeBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "800",
  },

  /* Certificate Modal styling */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  certModalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    width: "100%",
    maxHeight: "85%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  certModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  certBrand: {
    fontSize: 12,
    fontWeight: "900",
    color: "#4b5563",
    letterSpacing: 1.5,
  },
  closeCertBtn: {
    padding: 4,
  },
  certContainer: {
    padding: 20,
  },
  goldBorder: {
    borderWidth: 6,
    borderColor: "#d97706",
    borderRadius: 16,
    padding: 4,
  },
  innerCertBody: {
    borderWidth: 2,
    borderColor: "#fbbf24",
    borderRadius: 10,
    padding: 18,
    alignItems: "center",
    backgroundColor: "#fffdf9",
  },
  certMainTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#b45309",
    textAlign: "center",
    letterSpacing: 1,
    marginTop: 8,
  },
  certSubText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 12,
    fontStyle: "italic",
  },
  certRecipientName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
    marginVertical: 10,
    textAlign: "center",
  },
  certParagraph: {
    fontSize: 11,
    color: "#475569",
    textAlign: "center",
    lineHeight: 16,
    marginVertical: 12,
  },
  certSignatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 8,
  },
  signatureLine: {
    alignItems: "center",
    width: "45%",
  },
  signText: {
    fontSize: 9,
    color: "#94a3b8",
  },
  lineSpacer: {
    height: 1,
    backgroundColor: "#cbd5e1",
    width: "100%",
    marginVertical: 4,
  },
  signTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#475569",
  },
  downloadFileBtn: {
    backgroundColor: "#0d9488",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 0,
  },
  downloadFileBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
});
