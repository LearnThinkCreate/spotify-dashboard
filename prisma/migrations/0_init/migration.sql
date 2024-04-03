-- CreateTable
CREATE TABLE "artist_metadata" (
    "artist_id" TEXT NOT NULL,
    "artist" TEXT,
    "main_genre" TEXT,
    "secondary_genre" TEXT,
    "genres" TEXT,
    "popularity" INTEGER,
    "followers" INTEGER,
    "image_xl" JSONB,
    "image_lg" JSONB,
    "image_md" JSONB,
    "image_sm" JSONB,
    "images" JSON,
    "type" TEXT,
    "uri" TEXT,
    "external_url" TEXT,
    "href" TEXT,

    CONSTRAINT "artist_metadata_pkey" PRIMARY KEY ("artist_id")
);

-- CreateTable
CREATE TABLE "artist_tracks" (
    "id" SERIAL NOT NULL,
    "track_id" TEXT,
    "artist_id" TEXT,
    "is_main_artist" BOOLEAN,

    CONSTRAINT "artist_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spotify_history" (
    "id" INTEGER NOT NULL,
    "ts" TIMESTAMP(6) NOT NULL,
    "username" INTEGER,
    "platform" TEXT,
    "ms_played" INTEGER,
    "conn_country" TEXT,
    "ip_addr_decrypted" TEXT,
    "user_agent_decrypted" TEXT,
    "song" TEXT,
    "artist" TEXT,
    "album" TEXT,
    "URI" TEXT,
    "reason_start" TEXT,
    "reason_end" TEXT,
    "shuffle" BOOLEAN,
    "skipped" TEXT,
    "offline" TEXT,
    "offline_timestamp" DOUBLE PRECISION,
    "incognito_mode" BOOLEAN,
    "month" SMALLINT,
    "year" SMALLINT,
    "track_id" TEXT,
    "main_artist_id" TEXT,
    "percent_played" DOUBLE PRECISION,

    CONSTRAINT "spotify_history_pkey" PRIMARY KEY ("id","ts")
);

-- CreateTable
CREATE TABLE "track_metadata" (
    "track_id" TEXT NOT NULL,
    "song" TEXT,
    "album" TEXT,
    "explicit" BOOLEAN,
    "song_popularity" INTEGER,
    "main_artist_id" TEXT,
    "artist_names" TEXT,
    "artist_ids" TEXT,
    "album_id" TEXT,
    "album_release_date" TEXT,
    "album_release_date_precision" TEXT,
    "album_external_url" TEXT,
    "album_href" TEXT,
    "album_images" JSON,
    "album_type" TEXT,
    "album_uri" TEXT,
    "danceability" DOUBLE PRECISION,
    "energy" DOUBLE PRECISION,
    "key" INTEGER,
    "loudness" DOUBLE PRECISION,
    "mode" INTEGER,
    "speechiness" DOUBLE PRECISION,
    "acousticness" DOUBLE PRECISION,
    "instrumentalness" DOUBLE PRECISION,
    "liveness" DOUBLE PRECISION,
    "valence" DOUBLE PRECISION,
    "tempo" DOUBLE PRECISION,
    "duration_ms" INTEGER,
    "time_signature" INTEGER,
    "album_release_year" INTEGER,
    "album_decade" TEXT,
    "image_lg" JSONB,
    "image_md" JSONB,
    "image_sm" JSONB,
    "analysis_url" TEXT,

    CONSTRAINT "track_metadata_pkey" PRIMARY KEY ("track_id")
);

-- CreateIndex
CREATE INDEX "idx_artist_metadata_main_genre" ON "artist_metadata"("main_genre");

-- CreateIndex
CREATE INDEX "idx_artist_metadata_secondary_genre" ON "artist_metadata"("secondary_genre");

-- CreateIndex
CREATE INDEX "idx_artist_tracks_artist_id" ON "artist_tracks"("artist_id");

-- CreateIndex
CREATE INDEX "idx_artist_tracks_is_main_artist" ON "artist_tracks"("is_main_artist");

-- CreateIndex
CREATE INDEX "idx_artist_tracks_track_id" ON "artist_tracks"("track_id");

-- CreateIndex
CREATE INDEX "idx_spotify_history_album" ON "spotify_history"("album");

-- CreateIndex
CREATE INDEX "idx_spotify_history_main_artist_id" ON "spotify_history"("main_artist_id");

-- CreateIndex
CREATE INDEX "idx_spotify_history_month" ON "spotify_history"("month");

-- CreateIndex
CREATE INDEX "idx_spotify_history_track_id" ON "spotify_history"("track_id");

-- CreateIndex
CREATE INDEX "idx_spotify_history_year" ON "spotify_history"("year");

-- CreateIndex
CREATE INDEX "idx_track_metadata_album_decade" ON "track_metadata"("album_decade");

-- CreateIndex
CREATE INDEX "idx_track_metadata_album_id" ON "track_metadata"("album_id");

-- CreateIndex
CREATE INDEX "idx_track_metadata_album_release_year" ON "track_metadata"("album_release_year");

-- CreateIndex
CREATE INDEX "idx_track_metadata_main_artist_id" ON "track_metadata"("main_artist_id");

-- AddForeignKey
ALTER TABLE "artist_tracks" ADD CONSTRAINT "artist_tracks_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist_metadata"("artist_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "artist_tracks" ADD CONSTRAINT "artist_tracks_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "track_metadata"("track_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "spotify_history" ADD CONSTRAINT "spotify_history_main_artist_id_fkey" FOREIGN KEY ("main_artist_id") REFERENCES "artist_metadata"("artist_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "spotify_history" ADD CONSTRAINT "spotify_history_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "track_metadata"("track_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "track_metadata" ADD CONSTRAINT "track_metadata_main_artist_id_fkey" FOREIGN KEY ("main_artist_id") REFERENCES "artist_metadata"("artist_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

