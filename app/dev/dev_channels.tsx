import Clipboard from '@react-native-clipboard/clipboard';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
import { Button, ScrollView, Text } from "react-native";
import { Channel } from 'src/entity/channel';
import { useChannelIDs } from 'src/global_states/channels';
import { useChannels } from 'src/hooks/useChannels';
import { add_channel, APIChannel, get_channels } from "src/services/request/panya";
import toast from "src/services/toast";
import tw from "src/style/twrnc";

const DevChannels = (): React.ReactNode => {
    const [channels, setChannels] = useState<APIChannel[]>([]);
    const { push: pushChannel } = useChannels();
    const appChannels = useChannelIDs();

    useEffect(() => {
        (async () => {
            try {
                setChannels(await get_channels());
            } catch (e) {
                toast.err((e as any).toString());
            }
        })();
    }, [appChannels.length]);

    const copyClipboardCommaSep = useCallback(() => {
        try {
            Clipboard.setString(channels.map<string>((channel: APIChannel) => channel.url || "").join(","));
            toast.ok("Copied to clipboard");
        } catch (e) {
            toast.err((e as any).toString());
        }
    }, [channels]);

    const subscribeAllChannels = useCallback(async () => {
        for (const apiChannel of channels) {
            try {
                if (!apiChannel.url) {
                    continue;
                }
                const channel: Channel = {
                    channel_name: apiChannel.name,
                    channel_id: apiChannel.id,
                    is_sub: true,
                    source_type: apiChannel.source_type,
                    limit: apiChannel.limit,
                };
                await pushChannel([apiChannel.id, channel]);
            } catch (e) {
                console.error(e);
                toast.err((e as any).toString());
            }
        }
        toast.ok("Subscribed to feed sources")
    }, [channels]);

    const addRandomChannels = useCallback(async (amount: number) => {
        for (let i = 0; i < amount; i++) {
            const n = Math.floor(Math.random() * urls.length);
            const c = await add_channel(urls[n]);
            if (!c) {
                continue;
            }
            await pushChannel([c.channel_id, c]);
        }
    }, []);

    return (
        <ScrollView style={tw`flex`}>
            <Button color="purple" title="Back to settings" onPress={() => router.replace("/settings")} />
            <Button title="Copy comma separated" onPress={copyClipboardCommaSep} />
            <Button color={"orange"} title="Subscribe to all those feeds sources" onPress={subscribeAllChannels} />
            <Button color={"orange"} title="Add 10 random channels" onPress={() => addRandomChannels(10)} />
            <Text>{JSON.stringify(channels, null, 2)}</Text>
        </ScrollView>
    )
};

export default DevChannels;

const urls = [
    // News
    "https://www.cnn.com", "https://www.bbc.com", "https://www.aljazeera.com", "https://www.lemonde.fr", "https://www.spiegel.de", "https://www.elpais.com", "https://www.repubblica.it", "https://www.asahi.com", "https://www.theguardian.com", "https://www.nytimes.com", "https://www.timesofindia.com", "https://www.smh.com.au", "https://www.dailymail.co.uk", "https://www.globo.com", "https://www.france24.com", "https://www.rt.com", "https://www.xinhuanet.com", "https://www.koreatimes.co.kr", "https://www.nzherald.co.nz", "https://www.hindustantimes.com", "https://www.clarin.com", "https://www.corriere.it", "https://www.washingtonpost.com", "https://www.telegraph.co.uk", "https://www.ft.com", "https://www.rtve.es", "https://www.thelocal.fr", "https://www.arabnews.com", "https://www.dawn.com", "https://www.ansa.it", "https://www.nrk.no", "https://www.tellerreport.com", "https://www.dw.com", "https://www.rfi.fr", "https://www.laprensa.com.ni", "https://www.faz.net", "https://www.eluniversal.com.mx", "https://www.svd.se", "https://www.lefigaro.fr", "https://www.reuters.com", "https://www.marca.com", "https://www.folha.uol.com.br", "https://www.chinadaily.com.cn", "https://www.ilfattoquotidiano.it", "https://www.elmundo.es", "https://www.aftonbladet.se", "https://www.sueddeutsche.de", "https://www.bangkokpost.com", "https://www.straitstimes.com", "https://www.livemint.com", "https://www.scmp.com", "https://www.abc.net.au", "https://www.japantimes.co.jp",
    // Science / Technology / Finance
    "https://www.techcrunch.com", "https://www.wired.com", "https://www.theverge.com", "https://www.gizmodo.com", "https://www.cnet.com", "https://www.venturebeat.com", "https://www.arstechnica.com", "https://www.engadget.com", "https://www.ted.com", "https://www.zdnet.com", "https://www.fastcompany.com", "https://www.bloomberg.com", "https://www.marketwatch.com", "https://www.wsj.com", "https://www.forbes.com", "https://www.cnbc.com", "https://www.fortune.com", "https://www.investopedia.com", "https://www.coindesk.com", "https://www.theinformation.com", "https://www.recode.net", "https://www.medium.com", "https://www.popularmechanics.com", "https://www.scientificamerican.com", "https://www.nature.com", "https://www.newscientist.com", "https://www.space.com", "https://www.livescience.com", "https://www.phys.org", "https://www.quantamagazine.org", "https://www.economist.com", "https://www.sciencedaily.com", "https://www.fiercebiotech.com", "https://www.biomedcentral.com", "https://www.nih.gov", "https://www.techradar.com", "https://www.gsmarena.com", "https://www.pcmag.com", "https://www.t3.com", "https://www.mashable.com", "https://www.digitaltrends.com", "https://www.androidauthority.com", "https://www.moneysavingexpert.com", "https://www.techspot.com", "https://www.macrumors.com", "https://www.9to5mac.com", "https://www.techinasia.com", "https://www.xataka.com", "https://www.tomshardware.com", "https://www.theblock.co", "https://www.hackernews.com", "https://www.technologyreview.com",
    // Anime/Music/Cinema
    "https://www.imdb.com", "https://www.rottentomatoes.com", "https://www.metacritic.com", "https://www.animenewsnetwork.com", "https://www.crunchyroll.com", "https://www.myanimelist.net", "https://www.animeplanet.com", "https://www.filmfreeway.com", "https://www.boxofficemojo.com", "https://www.cinemablend.com", "https://www.fandango.com", "https://www.collider.com", "https://www.hollywoodreporter.com", "https://www.variety.com", "https://www.nme.com", "https://www.billboard.com", "https://www.rollingstone.com", "https://www.pitchfork.com", "https://www.stereogum.com", "https://www.spin.com", "https://www.loudersound.com", "https://www.ign.com", "https://www.denofgeek.com", "https://www.animetoday.com", "https://www.animenews.biz", "https://www.animetimes.com", "https://www.allocine.fr", "https://www.theplaylist.net", "https://www.avclub.com", "https://www.slashfilm.com", "https://www.soundtrack.net", "https://www.myanimelist.net", "https://www.animelab.com", "https://www.kotaku.com", "https://www.radiotimes.com", "https://www.tvguide.com", "https://www.senscritique.com", "https://www.empireonline.com", "https://www.moviepilot.de", "https://www.filmstarts.de", "https://www.filmaffinity.com", "https://www.cinematoday.jp", "https://www.oricon.co.jp", "https://www.musicradar.com", "https://www.last.fm", "https://www.allmusic.com", "https://www.genius.com", "https://www.whosampled.com", "https://www.albumoftheyear.org", "https://www.lyrics.com",
    // Photography/Manual hobbies/Gardening etc...
    "https://www.dpreview.com", "https://www.petaPixel.com", "https://www.fstoppers.com", "https://www.photographyblog.com", "https://www.popphoto.com", "https://www.digitalcameraworld.com", "https://www.photographylife.com", "https://www.thephoblographer.com", "https://www.slrlounge.com", "https://www.imaging-resource.com", "https://www.lightstalking.com", "https://www.shutterbug.com", "https://www.cambridgeincolour.com", "https://www.photo.net", "https://www.diyphotography.net", "https://www.exposureguide.com", "https://www.gardenersworld.com", "https://www.gardenista.com", "https://www.finegardening.com", "https://www.gardeningknowhow.com", "https://www.thespruce.com", "https://www.rhs.org.uk", "https://www.bhg.com/gardening", "https://www.backyardgardenlover.com", "https://www.gardenista.com", "https://www.hgtv.com/outdoors/gardening", "https://www.mygarden.com", "https://www.davesgarden.com", "https://www.treehugger.com", "https://www.familyhandyman.com", "https://www.popularwoodworking.com", "https://www.finewoodworking.com", "https://www.instructables.com", "https://www.diynetwork.com", "https://www.makezine.com", "https://www.thisoldhouse.com", "https://www.craftsy.com", "https://www.theartofmanliness.com", "https://www.woodmagazine.com", "https://www.diyphotography.net", "https://www.modelairplanenews.com", "https://www.rcgroups.com", "https://www.fineartamerica.com", "https://www.creativelive.com", "https://www.the3doodler.com", "https://www.craftgossip.com", "https://www.sewmamasew.com", "https://www.quiltingdaily.com", "https://www.weareknitters.com", "https://www.ravelry.com", "https://www.favecrafts.com"
]