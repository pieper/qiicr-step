class qiicrStepUI {
  constructor(options={}) {
    this.bottomBar = new qiicrStepBottomBar(options.bottomBar);
  }

  addLeftPanel(options={}) {
    this.leftPanel = new qiicrStepLeftPanel(options);
  }

  get progress() {
    return this.bottomBar.progress;
  }

  set progress(text) {
    this.bottomBar.progress = text;
  }
}

class qiicrStepBottomBar {
  constructor(options={}) {
    options.id = options.id || 'bottomBar';
    options.orientations = options.orientations || ['Axial', 'Sagittal', 'Coronal'];
    options.initialOrientation = options.initialOrientation || options.orientations[0];
    options.onOrientationSelected = options.onOrientationSelected || function () {};
    this.options = options;

    this.element = document.getElementById(options.id);

    // add progress text
    this.progressElement = document.createElement('span');
    this.progressElement.classList.add('progress');
    this.element.appendChild(this.progressElement);

    // add orientation selection
    this.options.orientations.forEach(orientation => {
      let span = document.createElement('span');
      span.innerText = orientation;
      span.classList.add('orientation');
      if (orientation == options.initialOrientation) {
        span.classList.add('selected');
      }
      this.element.appendChild(span);
      span.addEventListener('click', event => {
        document.querySelectorAll('#bottomBar .orientation').forEach(element => {
          element.classList.remove('selected');
        });
        event.target.classList.add('selected');
        options.onOrientationSelected(orientation.toLocaleLowerCase());
      });
    });

  }

  get progress() {
    return (this.progressElement.innerText);
  }

  set progress(text) {
    this.progressElement.innerText = text;
    this.progressElement.style.opacity = 100;
    let restoreProgress = function() {
      this.progressElement.innerText = '';
      this.progressElement.removeAttribute('style');
    };
    clearTimeout(this.progressTimeout);
    this.progressTimeout = setTimeout(restoreProgress.bind(this), 2000);
  }
}

class qiicrStepLeftPanel {
  constructor(options={}) {
    options.id = options.id || "leftPanel";
    options.subject = options.subject || "Subject not specified";
    options.seriesDescription = options.seriesDescription || "Series Description not specified";
    options.segments = options.segments || [];
    options.onSegmentVisibilityChanged = options.onSegmentVisibilityChanged || function (segment, visibility) {};
    options.onSegmentClicked = options.onSegmentClicked || function (segment) {};

    this.element = document.getElementById(options.id);

    this.subjectNode = document.createElement('p');
    this.subjectNode.innerText = options.subject;
    this.element.appendChild(this.subjectNode);

    this.seriesDescriptionNode = document.createElement('p');
    this.seriesDescriptionNode.innerText = options.seriesDescription;
    this.element.appendChild(this.seriesDescriptionNode);

    this.segmentNodes = [];
    options.segments.forEach(segment => {
      let segmentNode = document.createElement('div');
      let segmentDisplayNode = document.createElement('span');
      segmentDisplayNode.innerText = '\u2713';
      segmentDisplayNode.classList.add('visibleSegment');
      segmentDisplayNode.style.background  = segment.color;
      this.element.appendChild(segmentNode);
      segmentNode.appendChild(segmentDisplayNode);
      let segmentTextNode = document.createElement('span');
      segmentTextNode.innerText = segment.label;
      segmentNode.appendChild(segmentTextNode);

      segmentDisplayNode.addEventListener('click', event => {
        if (event.target.classList.contains('visibleSegment')) {
          event.target.classList.remove('visibleSegment');
          event.target.classList.add('invisibleSegment');
          options.onSegmentVisibilityChanged(segment.segmentNumber, false);
        } else {
          event.target.classList.remove('invisibleSegment');
          event.target.classList.add('visibleSegment');
          options.onSegmentVisibilityChanged(segment.segmentNumber, true);
        }
      });
      segmentTextNode.addEventListener('click', event => {
        options.onSegmentClicked(segment.segmentNumber);
      });
    });
  }
}
