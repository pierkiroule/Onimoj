import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function CosmojiD3({
  width = 320,
  height = 320,
  emojis = ['❄️', '🌌', '🧭', '🦭', '🔥', '🌬️', '🧊', '🐻', '🌙', '🧿'],
  interactive = false,
  selectedEmojis = [],
  onToggleEmoji,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear prior render
    container.innerHTML = '';

    // Read CSS variables from the surrounding container for dynamic theming
    let haloStroke = '#7a7fff';
    let haloGlowOpacity = 0.55;
    try {
      const style = getComputedStyle(container);
      const strokeVar = style.getPropertyValue('--emoji-halo-stroke').trim();
      const glowVar = style.getPropertyValue('--emoji-halo-glow-opacity').trim();
      if (strokeVar) haloStroke = strokeVar;
      if (glowVar) {
        const parsed = Number(glowVar);
        if (!Number.isNaN(parsed)) haloGlowOpacity = parsed;
      }
    } catch {
      // If reading computed styles fails, fall back to defaults
    }

    const reduceMotion = typeof window !== 'undefined' &&
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const animDuration = reduceMotion ? 0 : 140;

    const nodes = emojis.map((emoji, index) => ({ id: index, emoji }));
    const links = d3.range(emojis.length).map((i) => ({ source: i, target: (i + 1) % emojis.length }));
    // add a few cross links for constellation feel
    links.push({ source: 0, target: 5 }, { source: 2, target: 7 });

    // If exactly 3 emojis are selected, fix them at triangle vertices
    const selectedNodes = Array.isArray(selectedEmojis)
      ? selectedEmojis.map((e) => nodes.find((n) => n.emoji === e)).filter(Boolean)
      : [];
    const hasTriangle = selectedNodes.length === 3;
    if (hasTriangle) {
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.34;
      for (let i = 0; i < 3; i++) {
        const angleDeg = -90 + i * 120;
        const angle = (angleDeg * Math.PI) / 180;
        const n = selectedNodes[i];
        if (n) {
          n.fx = cx + radius * Math.cos(angle);
          n.fy = cy + radius * Math.sin(angle);
        }
      }
    }

    const svg = d3
      .select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height)
      .style('display', 'block');

    // Glow filter for selected halo
    const defs = svg.append('defs');
    const glow = defs
      .append('filter')
      .attr('id', 'emojiGlow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    glow
      .append('feDropShadow')
      .attr('dx', 0)
      .attr('dy', 0)
      .attr('stdDeviation', 4)
      .attr('flood-color', haloStroke)
      .attr('flood-opacity', haloGlowOpacity);

    const link = svg
      .append('g')
      .attr('stroke', 'rgba(255,255,255,0.6)')
      .attr('stroke-width', 1.2)
      .selectAll('line')
      .data(links)
      .enter()
      .append('line');

    if (hasTriangle) {
      link.style('opacity', 0.25);
    }

    // One group per emoji: halo circle + text label
    const nodeGroup = svg
      .append('g')
      .selectAll('g.cosmoji-node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'cosmoji-node')
      .attr('role', 'option')
      .attr('tabindex', interactive ? 0 : null)
      .attr('aria-selected', (d) => (selectedEmojis && selectedEmojis.includes(d.emoji) ? 'true' : 'false'))
      .style('cursor', interactive ? 'pointer' : 'default')
      .on('click', (event, d) => {
        if (!interactive) return;
        if (typeof onToggleEmoji === 'function') onToggleEmoji(d.emoji);
      })
      .on('keydown', (event, d) => {
        if (!interactive) return;
        const key = event.key;
        if (key === 'Enter' || key === ' ') {
          event.preventDefault();
          if (typeof onToggleEmoji === 'function') onToggleEmoji(d.emoji);
        }
      });

    // Halo ring (only visible when selected)
    nodeGroup
      .append('circle')
      .attr('r', (d) => (selectedEmojis && selectedEmojis.includes(d.emoji) ? 20 : 0))
      .attr('fill', 'none')
      .attr('stroke', 'var(--emoji-halo-stroke, #7a7fff)')
      .attr('stroke-width', 2)
      .attr('filter', 'url(#emojiGlow)')
      .attr('opacity', (d) => (selectedEmojis && selectedEmojis.includes(d.emoji) ? 1 : 0));

    // Emoji text label
    nodeGroup
      .append('text')
      .text((d) => d.emoji)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', (d) => (selectedEmojis && selectedEmojis.includes(d.emoji) ? 34 : 26))
      .style('opacity', (d) =>
        selectedEmojis && selectedEmojis.length > 0
          ? selectedEmojis.includes(d.emoji)
            ? 1
            : 0.7
          : 1
      );

    // Triangle overlay between the 3 selected emojis
    let triangleLines = null;
    if (hasTriangle) {
      const triEdges = [
        [selectedNodes[0], selectedNodes[1]],
        [selectedNodes[1], selectedNodes[2]],
        [selectedNodes[2], selectedNodes[0]],
      ];
      triangleLines = svg
        .append('g')
        .attr('class', 'onimoji-triangle')
        .selectAll('line.tri-edge')
        .data(triEdges)
        .enter()
        .append('line')
        .attr('class', 'tri-edge')
        .attr('stroke', haloStroke)
        .attr('stroke-width', 2.4)
        .attr('stroke-linecap', 'round')
        .attr('filter', 'url(#emojiGlow)')
        .attr('opacity', 0.95);
    }

    const simulation = d3
      .forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-60))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collision',
        d3.forceCollide((d) => (selectedEmojis && selectedEmojis.includes(d.emoji) ? 24 : 20))
      )
      .force('link', d3.forceLink(links).id((d) => d.id).distance(90).strength(0.7))
      .on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

        nodeGroup.attr('transform', (d) => `translate(${d.x}, ${d.y})`);

        if (hasTriangle && triangleLines) {
          triangleLines
            .attr('x1', (d) => d[0].x)
            .attr('y1', (d) => d[0].y)
            .attr('x2', (d) => d[1].x)
            .attr('y2', (d) => d[1].y);
        }
      });

    // Small pop animation for newly selected emojis
    if (selectedEmojis && selectedEmojis.length > 0) {
      nodeGroup.each(function (d) {
        const isSelected = selectedEmojis.includes(d.emoji);
        const g = d3.select(this);
        const c = g.select('circle');
        const t = g.select('text');
        if (isSelected) {
          c.transition().duration(animDuration).attr('opacity', 1).attr('r', 20);
          t.transition().duration(animDuration).style('font-size', 34);
        } else {
          c.transition().duration(animDuration).attr('opacity', selectedEmojis.length > 0 ? 0 : 0).attr('r', 0);
          t.transition().duration(animDuration).style('font-size', 26).style('opacity', selectedEmojis.length > 0 ? 0.7 : 1);
        }
      });
    }

    // gentle motion
    const jiggle = d3.interval(() => {
      nodes.forEach((n) => {
        n.vx += (Math.random() - 0.5) * 0.05;
        n.vy += (Math.random() - 0.5) * 0.05;
      });
    }, 1200);

    return () => {
      jiggle.stop();
      simulation.stop();
      svg.remove();
    };
  }, [width, height, interactive, emojis, onToggleEmoji, selectedEmojis]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
