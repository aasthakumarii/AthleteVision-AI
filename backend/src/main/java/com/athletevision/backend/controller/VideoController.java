
package com.athletevision.backend.controller;

import com.athletevision.backend.entity.Video;
import com.athletevision.backend.repository.VideoRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/videos")
@SecurityRequirement(name = "bearerAuth")
public class VideoController {

    private final VideoRepository videoRepository;

    public VideoController(VideoRepository videoRepository) {
        this.videoRepository = videoRepository;
    }

    @PostMapping
    public Video createVideo(@RequestBody Video video) {
        video.setId(null);
        video.setUploadedAt(java.time.LocalDateTime.now());
        return videoRepository.save(video);
    }

    @GetMapping
    public java.util.List<Video> getAllVideos() {
        return videoRepository.findAll();
    }
}
